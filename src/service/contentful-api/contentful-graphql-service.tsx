import { request, GraphQLClient } from 'graphql-request';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import { ContentfulApiContext } from './contentful-api-ctx';

export type ContentfulCollection<CType> = {
  items: CType[];
};

interface GetEndpointInput {
  spaceId: string;
  apiKey: string;
  env?: string;
}

export const getEndpoint = (input: GetEndpointInput): string => {
  let url = `https://graphql.contentful.com/content/v1/spaces/${input?.spaceId}`;
  if (input?.env) {
    url += `/environments/${input.env}`;
  }
  return `${url}?access_token=${input.apiKey}`;
};

type Input = Record<string, any> & {
  locale?: string;
  env?: string;
};

export async function gqlRequest<ReturnType>(
  spaceId: string,
  apiKey: string,
  query: string,
  input: Input = {}
): Promise<ReturnType> {
  const { env } = input;
  const endpoint = getEndpoint({ spaceId, apiKey, env });
  return request<ReturnType>(endpoint, query, input);
}

type UseGqlQueryOptions<ReturnType> = {
  key?: string;
  input?: { id?: string; preview?: boolean };
  // pipe?: (response: ReturnType) => ReturnType | P | Promise<P>;
  skip?: boolean;
  refetchInterval?: UseQueryOptions<ReturnType>['refetchInterval'];
  isDataEqual?: UseQueryOptions<ReturnType>['isDataEqual'];
};

export function useGqlQuery<ReturnType = any>(
  query?: string,
  options?: UseGqlQueryOptions<ReturnType>
) {
  const { client } = useContext(GraphQLClientCtx);
  if (!client) {
    console.warn(`No GraphQL Client available.`);
  }
  const { locale, preview } = useContext(ContentfulApiContext);
  const { key, input, skip, refetchInterval, isDataEqual } = options || {};
  const queryKey = key || [query, input?.id, input?.preview];

  return useQuery(
    queryKey,
    () =>
      client!
        .request<ReturnType, any>(query!, {
          preview,
          locale,
          ...input,
        })
        .then(response => response),
    {
      enabled: !!client && !skip && !!query,
      refetchInterval,
      isDataEqual,
    }
  );
}

export const GraphQLClientCtx = createContext({
  client: undefined as GraphQLClient | undefined,
});

export function GraphQLClientProvider({ children }: PropsWithChildren<any>) {
  const { spaceId, apiKey, environment } = useContext(ContentfulApiContext);

  const client = useMemo(() => {
    if (!spaceId || !apiKey) return undefined;
    return new GraphQLClient(getEndpoint({ spaceId, apiKey, env: environment }), {
      errorPolicy: 'all',
    });
  }, [apiKey, environment, spaceId]);

  return <GraphQLClientCtx.Provider value={{ client }}>{children}</GraphQLClientCtx.Provider>;
}
