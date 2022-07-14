import React, { FunctionComponent, useContext, useMemo } from 'react';
import { useQuery } from 'react-query';
import { BLOG_TEMPLATE_NAME, ContentfulBlogItem } from '../features/blog-layout/blog-layout-types';
import { PlaylistGql, PlaylistGqlResponse } from '../features/editor/editor-service';
import { ContentfulHeroItem, HERO_TEMPLATE_NAME } from '../features/hero-layout/hero-layout-types';
import {
  ContentfulProductItem,
  PRODUCT_TEMPLATE_NAME,
} from '../features/product-layout/product-layout-types';
import {
  ContentfulQuoteItem,
  QUOTE_TEMPLATE_NAME,
} from '../features/quote-layout/quote-layout-types';
import { useGraphQLClient } from '../service/contentful-api/contentful-graphql-service';
import { fetchContentTypes } from '../service/contentful-api/contentful-rest';
import { useRestClient } from '../service/contentful-api/contentful-rest-client-ctx';
import { useMappedData } from '../service/schema-connector/content-mapping-service';
import {
  ContentFeedGql,
  ContentfeedGqlResponse,
  ContentMappingConfig,
} from '../service/schema-connector/content-mapping.queries';
import { fetchAppDefinition } from '../service/use-app-definition';
import { filterTruthy } from '../utils/list-utils';
import { uncapitalize } from '../utils/string-utils';

type TemplateName =
  | typeof BLOG_TEMPLATE_NAME
  | typeof QUOTE_TEMPLATE_NAME
  | typeof PRODUCT_TEMPLATE_NAME
  | typeof HERO_TEMPLATE_NAME;

export type ContentfulItem = {
  sys: {
    id: string;
    publishedAt: string;
  };
};

export type TemplateData<TN extends TemplateName, D> = {
  templateName?: TN;
  items: D[];
  companyLogo?: string;
  assetFieldNames: string[];
};

export type ContentfulDataItem =
  | TemplateData<'blog', ContentfulBlogItem>
  | TemplateData<'quotes', ContentfulQuoteItem>
  | TemplateData<'products', ContentfulProductItem>
  | TemplateData<'heroes', ContentfulHeroItem>;

export const ContentfulDataContext = React.createContext({
  data: undefined as ContentfulDataItem | undefined,
  isLoading: false,
  error: undefined as unknown,
});

type Props = {
  contentFeedId?: string;
  appDefinitionName?: string;
  refetchInterval?: number;
};

export const ContentfulDataProvider: FunctionComponent<Props> = props => {
  console.log('ContentfulDataProvider', props);
  const { spaceId, apiKey, client: gqlClient } = useGraphQLClient();
  const { client: restClient } = useRestClient();
  const [listType, listId] = (props.contentFeedId || '').split(':');

  type QueryParams = {
    mappingConfig: ContentMappingConfig;
    filterItems?: { sys: { id: string } }[];
  };
  const playlistQuery = useQuery<QueryParams | undefined>(
    [ContentFeedGql, listType, listId, props.appDefinitionName],
    async () => {
      if (!gqlClient) {
        return undefined;
      }
      if (listType === 'feed') {
        let r: ContentfeedGqlResponse | undefined;
        r = await gqlClient.request<ContentfeedGqlResponse>(ContentFeedGql, {
          id: listId,
        });
        // TODO handle contentFeed.contentMappingConfig.config === null
        return {
          mappingConfig: r.contentFeed.contentMappingConfig.config,
          filterItems: filterTruthy(r.contentFeed.entriesCollection.items),
        };
      }
      if (listType === 'playlist') {
        if (!props.appDefinitionName) {
          return undefined;
        }
        const [appDefinitions, contentTypesResponse, playlistResponse] = await Promise.all([
          fetchAppDefinition().then(r => r.find(d => d.name === props.appDefinitionName)),
          fetchContentTypes(spaceId, apiKey),
          gqlClient.request<PlaylistGqlResponse>(PlaylistGql, { id: listId }),
        ]);
        // console.log('appDefinitons', appDefinitions);
        const playlistItems = playlistResponse.screencloudPlaylist.entriesCollection?.items;

        // const restEntries = await Promise.all(
        //   playlistItems.map(item => restClient.getEntry(item.sys.id))
        // );
        // console.log('restEntries', restEntries);

        const contentTypeId = uncapitalize(playlistItems[0]?.__typename);
        if (!contentTypeId) {
          console.warn('Content feed has no entries');
          return undefined;
        }

        const ct = contentTypesResponse.items.find(ct => ct.sys.id === contentTypeId);
        if (!ct) {
          console.warn(`Content type ${contentTypeId} does not exists`);
          return undefined;
        }

        const mapping: any = {};
        appDefinitions?.fields.forEach(field => {
          const ctField = ct.fields.find(ctField => ctField.id === field.name);
          // console.log(`field`, field.name, ctField);
          if (!ctField) {
            console.warn(`Content type ${contentTypeId} has no field ${field.name}`);
            return;
          }
          if (ctField.type === 'Link') {
            if (ctField.linkType === 'Asset') {
              mapping[field.name] = `${field.name}:Asset`;
            }
            return;
          }
          mapping[field.name] = `${field.name}:${ctField.type}`;
        });

        return {
          mappingConfig: { contentType: contentTypeId, name: contentTypeId, mapping },
          filterItems: filterTruthy(playlistItems),
        };
      }
      return undefined;
    },
    { enabled: !!spaceId && !!apiKey }
  );

  const mappingConfig = playlistQuery.data?.mappingConfig;
  const filterItems = useMemo(
    () => filterTruthy(playlistQuery.data?.filterItems),
    [playlistQuery.data?.filterItems]
  );
  // console.log('mappingConfig', mappingConfig);

  // useEffect(() => {
  //   if (contentFeed) {
  //     console.group(`Contentful Content feed`);
  //     console.log(contentFeed);
  //     console.groupEnd();
  //   }
  // }, [contentFeed])

  // const mappingConfig = contentFeed?.contentMappingConfig.config;

  const assetFieldNames = useMemo(() => {
    if (!mappingConfig?.mapping) return [];
    return getAssetKeysFromMapping(mappingConfig.mapping);
  }, [mappingConfig?.mapping]);

  const { queryResponse, items = [] } = useMappedData(mappingConfig, {
    filterItems,
    refetchInterval: props.refetchInterval,
  });

  const isLoading = playlistQuery.isLoading || queryResponse.isLoading;

  let error: any = '';
  // contentFeed === null ? `There is no ContentFeed with id "${props.contentFeedId}"` : undefined;
  if (!error) error = playlistQuery.error || queryResponse.error;

  const templateName = mappingConfig?.name as TemplateName | undefined;
  const companyLogo = mappingConfig?.constants?.logoUrl;

  return (
    <ContentfulDataContext.Provider
      value={{
        isLoading,
        error,
        data: {
          items,
          templateName,
          companyLogo,
          assetFieldNames,
        },
      }}
    >
      {props.children}
    </ContentfulDataContext.Provider>
  );
};

function getAssetKeysFromMapping(mapping: Record<string, string>) {
  return Object.entries(mapping).reduce(
    (assetFields, [key, value]) =>
      value.split(':').pop() === 'Asset' ? [...assetFields, key] : assetFields,
    [] as string[]
  );
}

export const useContentfulData = () => useContext(ContentfulDataContext);
