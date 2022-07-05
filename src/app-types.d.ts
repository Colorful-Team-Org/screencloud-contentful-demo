export type AppConfig = {
  spaceId: string;
  apiKey: string;
  previewApiKey?: string;
  contentFeed: string;
  locale?: string;
  preview?: boolean;
  fetchInterval?: number;
  slideDuration?: number;
};
