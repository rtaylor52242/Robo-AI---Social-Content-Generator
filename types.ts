
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
  Sarcastic = 'Sarcastic',
  Optimistic = 'Optimistic',
  Serious = 'Serious',
  Friendly = 'Friendly',
  Dramatic = 'Dramatic',
  Futuristic = 'Futuristic',
  Retro = 'Retro',
  Whimsical = 'Whimsical',
  Grateful = 'Grateful',
  Direct = 'Direct',
}

export enum SocialPlatform {
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter/X',
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  WhatsApp = 'WhatsApp',
  TikTok = 'TikTok',
  Threads = 'Threads',
}

export interface GeneratedPost {
  platform: SocialPlatform;
  text: string;
  imageUrl: string;
  imageError?: string;
  isEditable?: boolean;
}

export interface TextGenerationResult {
  platform: SocialPlatform;
  text: string;
  imagePrompt: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  idea: string;
  tones: Tone[];
  posts: GeneratedPost[];
}
