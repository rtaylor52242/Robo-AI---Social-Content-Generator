
export enum Tone {
  Professional = 'Professional',
  Witty = 'Witty',
  Urgent = 'Urgent',
  Inspirational = 'Inspirational',
  Casual = 'Casual',
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
