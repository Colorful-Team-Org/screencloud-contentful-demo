import { gql } from 'graphql-request';

export const ContentFeedsGql = gql`
  query ($preview: Boolean) {
    contentFeedCollection(preview: $preview) {
      items {
        name
        sys {
          id
        }
        contentMappingConfig {
          config
        }
      }
    }
  }
`;
export type ContentFeedsGqlResponse = {
  contentFeedCollection: {
    items: {
      name: string;
      sys: { id: string };
    }[];
    contentMappingConfig: ContentMappingItem;
  };
};

export const ContentFeedGql = gql`
  query ContentFeed($id: String!, $preview: Boolean, $locale: String) {
    contentFeed(id: $id, locale: $locale, preview: $preview) {
      contentMappingConfig {
        name
        config
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
export type ContentfeedGqlResponse = {
  contentFeed: {
    contentMappingConfig: ContentMappingItem;
    entriesCollection: {
      items: ({ __typename: string; sys: { id: string } } | null)[];
    };
  };
};

export type ContentTypeMapping = {
  contentType: string;
  mapping: Record<string, string>;
};

type Sys = {
  __typename?: 'Sys';
  environmentId: string;
  firstPublishedAt?: string;
  id: string;
  publishedAt?: string;
  publishedVersion?: number;
  spaceId: string;
};

type ContentfulMetadata = {
  __typename?: 'ContentfulMetadata';
  tags: {
    __typename?: 'ContentfulTag';
    id: string;
    name: string;
  };
};

export type ContentMappingConfig = {
  constants?: {
    baseUrl?: string;
    logoUrl?: string;
  };
  contentfulMetadata?: ContentfulMetadata;
  contentType: string;
  mapping: Record<string, string>;
  name: string;
  sys?: Sys;
};

export type ContentMappingItem = {
  config: ContentMappingConfig;
  name: string;
};
