
import { GoogleGenAI, Type } from "@google/genai";
import { Tone, GeneratedPost, SocialPlatform, TextGenerationResult } from '../types';
import { PLATFORM_CONFIG } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateSocialPosts(idea: string, tone: Tone): Promise<GeneratedPost[]> {
  try {
    const textGenerationPrompt = `
      You are an expert social media content creator and prompt engineer for AI image generation.
      Your task is to generate social media posts and corresponding image prompts based on an idea and a desired tone.

      **Input Idea:** "${idea}"
      **Desired Tone:** "${tone}"

      Generate one post for each of the following platforms: LinkedIn, Twitter/X, and Instagram.

      For each platform, you must provide:
      1.  **Post Text:** Compelling text tailored to the platform's audience and format. For Instagram, include relevant hashtags.
      2.  **Image Prompt:** A detailed, visually descriptive prompt for an AI image generator. This prompt is crucial and must be crafted with care.

      **Image Prompt Requirements:**
      -   **Subject:** Clearly define the main subject, directly derived from the core of the **Input Idea**.
      -   **Style:** Specify an artistic style that fits the platform and the **Desired Tone**. Examples: 'cinematic photo', 'digital illustration', '3D render', 'minimalist graphic design'.
      -   **Mood & Atmosphere:** Describe the mood that the image should evoke, directly reflecting the **Desired Tone**. Examples: 'professional and ambitious', 'energetic and exciting', 'urgent and high-stakes', 'calm and inspirational'.
      -   **Composition & Details:** Include details about lighting, color palette, and composition to create a visually stunning image.
      -   **Platform Optimization:**
          -   **LinkedIn:** The image should be professional, clean, and inspiring. Think corporate-style photography or high-quality illustrations.
          -   **Twitter/X:** The image needs to be dynamic, bold, and attention-grabbing to stop scrolling.
          -   **Instagram:** The image must be aesthetic, vibrant, and photo-realistic. It should look like a high-quality photograph.

      Return the response as a valid JSON array of objects, following the specified schema.
    `;

    const textGenerationSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: {
            type: Type.STRING,
            enum: Object.values(SocialPlatform),
            description: 'The social media platform.',
          },
          text: {
            type: Type.STRING,
            description: 'The generated text for the social media post. For Instagram, include relevant hashtags.',
          },
          imagePrompt: {
            type: Type.STRING,
            description: 'A detailed prompt for an AI image generator to create a relevant visual.',
          },
        },
        required: ['platform', 'text', 'imagePrompt'],
      },
    };

    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: textGenerationPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: textGenerationSchema,
      },
    });

    const textResults: TextGenerationResult[] = JSON.parse(textResponse.text);

    if (!textResults || textResults.length === 0) {
      throw new Error("The AI failed to generate content. Please try a different idea.");
    }
    
    // Generate images sequentially with a delay to avoid rate-limiting errors.
    const combinedPosts: GeneratedPost[] = [];
    for (const result of textResults) {
      const platformConfig = PLATFORM_CONFIG[result.platform];
      let imageUrl = 'https://picsum.photos/500/500?grayscale';

      if (platformConfig) {
        try {
          // Add a delay before each image generation request to respect rate limits.
          await new Promise(resolve => setTimeout(resolve, 1200));

          const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: result.imagePrompt,
            config: {
              numberOfImages: 1,
              aspectRatio: platformConfig.aspectRatio,
            },
          });
          const base64Image = imageResponse?.generatedImages?.[0]?.image?.imageBytes;
          if (base64Image) {
            imageUrl = `data:image/png;base64,${base64Image}`;
          } else {
            console.error(`Image generation succeeded but no image data was returned for ${result.platform}.`);
             // Throw an error to be caught by the main handler, as this is an unexpected state.
            throw new Error(`Image data missing for ${result.platform}.`);
          }
        } catch (imageError) {
          console.error(`Error generating image for ${result.platform}:`, imageError);
          // Re-throw the error to be handled by the main catch block, which will display a UI message.
          // This stops the process if image generation fails, which is desired behavior for quota errors.
          throw imageError;
        }
      } else {
        console.warn(`No config found for platform: ${result.platform}. Skipping image generation.`);
      }

      combinedPosts.push({
        platform: result.platform,
        text: result.text,
        imageUrl: imageUrl,
      });
    }

    return combinedPosts;

  } catch (error) {
    console.error("Error generating social posts:", error);
    
    let message = "Failed to communicate with the AI. Please check your connection and try again.";
    const errorString = JSON.stringify(error).toLowerCase();

    if (errorString.includes("429") || errorString.includes("quota")) {
      message = "You've exceeded your API request quota. Please check your plan and billing details, and try again later.";
    } else if (errorString.includes("api key")) {
      message = "There seems to be an issue with your API key. Please ensure it's valid and configured correctly.";
    } else if (error instanceof Error) {
        // Fallback for other error types that are actual Error instances
        message = error.message;
    }

    throw new Error(message);
  }
}