import { createContext } from 'react';

export type ContentfulApiConfig = {
  apiKey?: string;
  spaceId?: string;
  environment?: string;
  preview?: boolean;
};

export const ContentfulApiContext = createContext<ContentfulApiConfig>({});
