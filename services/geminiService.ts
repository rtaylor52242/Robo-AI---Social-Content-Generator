
import { GoogleGenAI, Type } from "@google/genai";
import { Tone, GeneratedPost, SocialPlatform, TextGenerationResult } from '../types';
import { PLATFORM_CONFIG } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateSocialPosts(idea: string, tones: Tone[]): Promise<GeneratedPost[]> {
  try {
    const textGenerationPrompt = `
      You are an expert social media content creator and prompt engineer for AI image generation.
      Your task is to generate social media posts and corresponding image prompts based on an idea and a desired set of tones.

      **Input Idea:** "${idea}"
      **Desired Tones:** "${tones.join(', ')}"

      Generate one post for each of the following platforms: LinkedIn, Twitter/X, Instagram, Facebook, WhatsApp, TikTok, and Threads.

      For each platform, you must provide:
      1.  **Post Text:** Compelling text tailored to the platform's audience and format. It should reflect the **Desired Tones**. For Instagram and TikTok, include relevant hashtags.
      2.  **Image Prompt:** A detailed, visually descriptive prompt for an AI image generator. This prompt is crucial and must be crafted with care.

      **Image Prompt Requirements:**
      -   **Subject:** Clearly define the main subject, directly derived from the core of the **Input Idea**.
      -   **Style:** Specify an artistic style that fits the platform and the **Desired Tones**. Examples: 'cinematic photo', 'digital illustration', '3D render', 'minimalist graphic design'.
      -   **Mood & Atmosphere:** Describe the mood that the image should evoke, directly reflecting the **Desired Tones**. Examples: 'professional and ambitious', 'energetic and exciting', 'urgent and high-stakes', 'calm and inspirational'.
      -   **Composition & Details:** Include details about lighting, color palette, and composition to create a visually stunning image.
      -   **Platform Optimization:**
          -   **LinkedIn:** The image should be professional, clean, and inspiring. Think corporate-style photography or high-quality illustrations.
          -   **Twitter/X:** The image needs to be dynamic, bold, and attention-grabbing to stop scrolling.
          -   **Instagram:** The image must be aesthetic, vibrant, and photo-realistic. It should look like a high-quality photograph.
          -   **Facebook:** The image should be engaging, community-focused, and shareable. Bright colors and relatable subjects work well.
          -   **WhatsApp:** The image should be personal, direct, and clear. Simple, high-contrast visuals often work best for small screens.
          -   **TikTok:** The image should be vertical (9:16), high-energy, and visually striking. It acts as a cover or background for a viral video concept.
          -   **Threads:** The image should be minimalist, conversational, and modern. Clean lines and text-friendly compositions are preferred.

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
            description: 'The generated text for the social media post. For Instagram and TikTok, include relevant hashtags.',
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
      let imageError: string | undefined;

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
            imageError = "Image data missing.";
          }
        } catch (imageErr) {
          console.error(`Error generating image for ${result.platform}:`, imageErr);
          // Instead of throwing, we record the error and continue.
          // The imageUrl remains as the placeholder.
          imageError = "Image generation failed.";
        }
      } else {
        console.warn(`No config found for platform: ${result.platform}. Skipping image generation.`);
      }

      combinedPosts.push({
        platform: result.platform,
        text: result.text,
        imageUrl: imageUrl,
        imageError: imageError,
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