import { createClient } from 'contentful';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { ContentfulApiConfigCtx } from './contentful-api-ctx';

type ContentfulRestClient = ReturnType<typeof createClient>;

const ContentfulRestClientCtx = createContext({
  spaceId: undefined as undefined | string,
  apiKey: undefined as undefined | string,
  client: undefined as ContentfulRestClient | null | undefined,
});

export function useRestClient() {
  const { client, spaceId, apiKey } = useContext(ContentfulRestClientCtx);
  if (!spaceId || !apiKey) {
    throw new Error('No Contentful API configuration available.');
  }
  if (!client) {
    throw new Error(`No Contentful rest client available.`);
  }
  return {
    spaceId,
    apiKey,
    client,
  };
}
export function ContentfulRestClientProvider(props: PropsWithChildren<any>) {
  const { spaceId, apiKey, previewApiKey, environment, locale, preview } =
    useContext(ContentfulApiConfigCtx);

  const client = useMemo(() => {
    const accessToken = !!preview ? previewApiKey : apiKey;
    if (!spaceId || !accessToken) return null;
    return createClient({
      space: spaceId,
      accessToken,
      host: preview ? 'preview.contentful.com' : undefined,
    });
  }, [apiKey, preview, previewApiKey, spaceId]);

  return (
    <ContentfulRestClientCtx.Provider value={{ client, spaceId, apiKey }}>
      {props.children}
    </ContentfulRestClientCtx.Provider>
  );
}
