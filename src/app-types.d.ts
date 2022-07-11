export type AppConfig = {
  spaceId: string;
  apiKey: string;
  previewApiKey?: string;
  locale?: string;
  preview?: boolean;
  contentFeed: string;
  contentType?: string;
  fetchInterval?: number;
  slideDuration?: number;
};
