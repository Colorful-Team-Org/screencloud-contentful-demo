import { gql } from 'graphql-request';
import { useQuery, UseQueryOptions } from 'react-query';
import { gqlRequest } from '../../service/contentful-api/contentful-graphql-service';
import { QueryTypeFieldsGql } from '../../service/contentful-api/contentful-querries';
import { fetchContentTypes } from '../../service/contentful-api/contentful-rest';
import {
  ContentFeedsGql,
  ContentFeedsGqlResponse,
  ContentMappingConfig,
} from '../../service/schema-connector/content-mapping.queries';

const PlaylistsGql = gql`
  query ($preview: Boolean) {
    screencloudPlaylistCollection(preview: $preview) {
      items {
        title
        ... on Entry {
          sys {
            id
          }
        }
      }
    }
  }
`;
type PlaylistsGqlResponse = {
  screencloudPlaylistCollection: {
    items: { title?: string; sys: { id: string } }[];
  };
};

export const PlaylistGql = gql`
  query ($id: String!, $preview: Boolean) {
    screencloudPlaylist(id: $id, preview: $preview) {
      title
      sys {
        id
      }
      entriesCollection(limit: 100) {
        items {
          __typename
          ... on Entry {
            sys {
              id
            }
          }
        }
      }
    }
  }
`;
export type PlaylistGqlResponse = {
  screencloudPlaylist: {
    title?: string;
    sys: { id: string };
    entriesCollection: {
      items: {
        __typename: string;
        sys: { id: string };
      }[];
    };
  };
};

export function useFeedsAndPlaylistsQuery(
  spaceId = '',
  apiKey = '',
  preview = false,
  options?: UseQueryOptions<{
    feeds?: ContentFeedsGqlResponse['contentFeedCollection']['items'];
    playlists?: PlaylistsGqlResponse['screencloudPlaylistCollection']['items'];
  }>
) {
  return useQuery(
    [useFeedsAndPlaylistsQuery, spaceId, apiKey, preview],
    async () => {
      const contentTypes = await fetchContentTypes(spaceId, apiKey);
      /** check which if the space support the necessary ctypes: */
      const contentFeedCt = contentTypes.items?.find(ct => ct.sys.id === 'contentFeed');
      const playlistCt = contentTypes.items?.find(ct => ct.sys.id === 'screencloudPlaylist');

      const contentFeedsAvailable = !!contentFeedCt?.fields.find(
        f => f.id === 'contentMappingConfig'
      );
      const playlistAvailable = !!playlistCt?.fields.find(f => f.id === 'entries');

      // console.log(`ccc`, contentFeedCt, playlistCt);
      const [feedsResponse, playlistResponse] = await Promise.all([
        contentFeedsAvailable
          ? gqlRequest<ContentFeedsGqlResponse>(spaceId, apiKey, ContentFeedsGql, { preview })
          : undefined,
        playlistAvailable
          ? gqlRequest<PlaylistsGqlResponse>(spaceId, apiKey, PlaylistsGql, { preview })
          : undefined,
      ]);
      // console.log(`feedsResponse, playlistResponse`, feedsResponse, playlistResponse);

      return {
        feeds: feedsResponse?.contentFeedCollection.items,
        playlists: playlistResponse?.screencloudPlaylistCollection.items,
      };
    },
    { ...options, enabled: options?.enabled !== false && !!spaceId && !!apiKey }
  );
}

export function useContentFeedQuery(spaceId: string, apiKey: string, preview = false) {
  return useQuery<
    { name: string; id: string; contentMappingConfig?: { config?: ContentMappingConfig } }[]
  >(
    ['contentfeeds', spaceId, apiKey, preview],
    async () => {
      try {
        const response = await gqlRequest<any>(spaceId!, apiKey!, ContentFeedsGql, {
          preview,
        });

        return (
          response.contentFeedCollection.items.map((item: any) => ({
            name: item.name,
            id: item.sys.id,
            contentMappingConfig: item.contentMappingConfig,
          })) || []
        );
      } catch (err) {
        return [];
      }
    },
    { enabled: !!spaceId && !!apiKey, retry: false }
  );
}

export function useQueryTypeFieldsQuery(
  spaceId: string,
  apiKey: string,
  options?: { enabled: boolean }
) {
  return useQuery(
    ['queryTypes', spaceId, apiKey],
    async () => {
      try {
        const response = await gqlRequest<any>(spaceId!, apiKey!, QueryTypeFieldsGql);
        console.log(`response`, response);
        return response.__schema.queryType.fields.map((f: any) => f.name) || [];
      } catch (err) {
        console.warn('Error while fetching QueryType fields');
        return [];
      }
    },
    { enabled: options?.enabled !== false && !!spaceId && !!apiKey, retry: false }
  );
}
