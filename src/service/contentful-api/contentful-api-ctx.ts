import { createContext } from 'react';

export type ContentfulApiConfig = {
  apiKey?: string;
  previewApiKey?: string;
  spaceId?: string;
  locale?: string;
  environment?: string;
  preview?: boolean;
};

export const ContentfulApiConfigCtx = createContext<ContentfulApiConfig>({});
