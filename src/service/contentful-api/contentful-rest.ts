import { useContext } from 'react';
import { QueryClient, QueryOptions, useQueries, useQuery } from 'react-query';
import { ContentfulApiContext } from './contentful-api-ctx';

const BASE_PATH = `https://cdn.contentful.com`;
const PREVIEW_BASE_PATH = `https://preview.contentful.com`;

export const getSpaceUrl = (space: string, preview = false): string =>
  `${preview === true ? PREVIEW_BASE_PATH : BASE_PATH}/spaces/${space}`;

export type LocalesResponse = {
  sys: { type: string };
  message?: string;
  total: number;
  skip: number;
  limit: number;
  items: {
    code: string;
    name: string;
    default: boolean;
    fallbackCode: any;
  }[];
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 5,
    },
  },
});

const getLocalesUrl = (space: string, token: string, env = 'master', preview = false) => {
  const url = `${getSpaceUrl(space, preview)}/environments/${env}/locales?access_token=${token}`;
  return url;
};

export const getLocales = async (url: string) => {
  return queryClient.fetchQuery(url, () =>
    fetch(url)
      .then(response => response.json() as Promise<LocalesResponse>)
      .then(response => {
        // console.log(`response`, response);
        if (response.sys.type === 'Error') {
          throw response.message;
        }
        return response.items;
      })
  );
};

export const getLocalesQueryOptions = (
  space: string,
  token: string,
  env = 'master',
  preview = false
) => {
  const url = getLocalesUrl(space, token, env, preview);
  return {
    queryKey: url,
    queryFn: () => getLocales(url),
  };
};

export const ensureLocale = async (
  space: string,
  token: string,
  requestedLocale?: string,
  env?: string,
  preview = false
) => {
  const url = getLocalesUrl(space, token, env, preview);
  const remoteLocales = await getLocales(url);
  if (!requestedLocale) {
    return remoteLocales.find(r => r.default)?.code || 'en-US';
  }

  const availableLocales = remoteLocales.map(item => item.code);
  const selectedLocale =
    availableLocales.find(locales => locales === requestedLocale) ||
    remoteLocales.find(r => r.default)?.code ||
    'en-US';

  return selectedLocale;
};

export function useLocales(space?: string, apiKey?: string, preview = false) {
  return useQuery({
    ...getLocalesQueryOptions(space!, apiKey!, undefined, preview),
    enabled: !!space && !!apiKey,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
