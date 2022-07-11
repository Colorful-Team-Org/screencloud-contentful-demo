import { createClient } from 'contentful';
import { PropsWithChildren, useContext, useMemo } from 'react';
import { createContext } from 'vm';
import { ContentfulApiContext } from './contentful-api-ctx';

type ContentfulRestClient = ReturnType<typeof createClient>;

const ContentfulRestClientCtx = createContext({
  client: undefined as ContentfulRestClient | null | undefined,
});
export function ContentfulRestClientProvider(props: PropsWithChildren<any>) {
  const { spaceId, apiKey, environment, locale, preview } = useContext(ContentfulApiContext);

  const client = useMemo(() => {
    if (!spaceId || !apiKey) return null;
    return createClient({ space: spaceId, environment, accessToken: apiKey });
  }, [apiKey, environment, spaceId]);

  return (
    <ContentfulRestClientCtx.Provider value={client}>
      {props.children}
    </ContentfulRestClientCtx.Provider>
  );
}
