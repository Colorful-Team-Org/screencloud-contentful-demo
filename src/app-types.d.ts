export type AppConfig = {
  spaceId: string;
  apiKey: string;
  previewApiKey?: string;
  locale?: string;
  preview?: boolean;
  contentFeed: string;
  appDefinitionName?: string;
  fetchInterval?: number;
  slideDuration?: number;
};
