
export enum Tone {
  Professional = 'Professional',
  Witty = 'Witty',
  Urgent = 'Urgent',
  Inspirational = 'Inspirational',
  Casual = 'Casual',
  Humorous = 'Humorous',
  Authoritative = 'Authoritative',
  Empathetic = 'Empathetic',
  Storytelling = 'Storytelling',
  Educational = 'Educational',
  Minimalist = 'Minimalist',
  Playful = 'Playful',
  Bold = 'Bold',
  Mysterious = 'Mysterious',
  Luxurious = 'Luxurious',
  Nostalgic = 'Nostalgic',
}

export enum SocialPlatform {
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter/X',
  Instagram = 'Instagram',
}

export interface GeneratedPost {
  platform: SocialPlatform;
  text: string;
  imageUrl: string;
}

export interface TextGenerationResult {
  platform: SocialPlatform;
  text: string;
  imagePrompt: string;
}