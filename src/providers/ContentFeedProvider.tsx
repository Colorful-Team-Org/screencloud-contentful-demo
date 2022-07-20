import React, { FunctionComponent, useContext, useMemo } from 'react';
import { useQuery } from 'react-query';
import { BLOG_TEMPLATE_NAME, ContentfulBlogItem } from '../features/blog-layout/blog-layout-types';
import { ContentfulHeroItem, HERO_TEMPLATE_NAME } from '../features/hero-layout/hero-layout-types';
import {
  ContentfulProductItem,
  PRODUCT_TEMPLATE_NAME,
} from '../features/product-layout/product-layout-types';
import {
  ContentfulQuoteItem,
  QUOTE_TEMPLATE_NAME,
} from '../features/quote-layout/quote-layout-types';
import { ContentfulApiConfigCtx } from '../service/contentful-api/contentful-api-ctx';
import {
  useGqlQuery,
  useGraphQLClient,
} from '../service/contentful-api/contentful-graphql-service';
import { useRestClient } from '../service/contentful-api/contentful-rest-client-ctx';
import {
  mapContent,
  mapLink,
  queryStringFromMappingConfig,
} from '../service/schema-connector/content-mapping-service';
import {
  ContentFeedGql,
  ContentfeedGqlResponse,
} from '../service/schema-connector/content-mapping.queries';
import { filterTruthy } from '../utils/list-utils';

type Props = {
  contentFeedId?: string;
  appDefinitionName?: string;
  refetchInterval?: number;
};

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
  items: {
    templateName?: TN;
    companyLogo?: string;
    assetFieldNames?: string[];
    data: D;
  }[];
};

export type ContentFeedData =
  | TemplateData<'blog', ContentfulBlogItem>
  | TemplateData<'quotes', ContentfulQuoteItem>
  | TemplateData<'products', ContentfulProductItem>
  | TemplateData<'heroes', ContentfulHeroItem>;

export const ContentFeedItemsContext = React.createContext({
  data: undefined as ContentFeedData | undefined,
  isLoading: false,
  error: undefined as unknown,
});

export const ContentFeedItemsProvider: FunctionComponent<Props> = props => {
  // console.log('ContentFeedProvider', props);
  const { preview, locale } = useContext(ContentfulApiConfigCtx);
  const { client: gqlClient } = useGraphQLClient();
  const { client: restClient } = useRestClient();

  const contentFeedQuery = useGqlQuery<ContentfeedGqlResponse>(ContentFeedGql, {
    key: [ContentFeedGql, props.contentFeedId, preview],
    input: { id: props.contentFeedId },
    isDataEqual: (prev, curr) => {
      if (!!preview) return false;
      const isEqual = prev?.contentFeed.sys.publishedAt === curr?.contentFeed.sys.publishedAt;
      // console.log('contentfeed isEqual', isEqual);
      return isEqual;
    },
    refetchInterval: props.refetchInterval,
    notifyOnChangePropsExclusions: ['isFetching', 'isFetchedAfterMount'],
  });
  const contentFeed = contentFeedQuery.data?.contentFeed;

  const query = useQuery<ContentFeedData | undefined>(
    [contentFeed, preview, locale],
    async () => {
      if (!contentFeed) return undefined;

      const filterItems = filterTruthy(contentFeed.entriesCollection.items);
      const mappingConfig = contentFeed.contentMappingConfig?.config;

      /* Apply mapping config when available: */
      if (mappingConfig) {
        let assetFieldNames: string[] | undefined;
        try {
          assetFieldNames = getAssetKeysFromMapping(mappingConfig.mapping);
        } catch (err) {
          console.warn(err);
        }
        try {
          const queryString = queryStringFromMappingConfig(mappingConfig);
          const response = await gqlClient.request(queryString, { preview, locale });
          const contentfulItems = response?.[`${mappingConfig.contentType}Collection`].items;
          const sorted = filterTruthy(
            filterItems?.map(({ sys: { id } }) => contentfulItems.find((c: any) => c.sys.id === id))
          );
          const items = sorted ? mapContent(mappingConfig, sorted) : [];

          return {
            items: items.map(item => ({
              data: item,
              templateName: mappingConfig.name as any,
              companyLogo: mappingConfig?.constants?.logoUrl,
              assetFieldNames,
            })),
            // companyLogo: mappingConfig?.constants?.logoUrl,
          } as ContentFeedData;
        } catch (err) {
          console.warn(err);
        }
      } else {
        /* if there is no mapping config, we try to map ctype directly */
        /* using REST api to get all required entries */
        const response = await Promise.all(
          filterItems?.map(item =>
            restClient.getEntry(item.sys.id, { locale }).catch(err => {
              console.warn(err);
              return undefined;
            })
          ) || []
        );
        // console.log('response', response);
        const assetFieldNames: string[] = [];

        /* maping response to appropriate schema */
        const items = filterTruthy(response)?.map(res => {
          let entry: Record<string, any> = {
            sys: {
              ...res.sys,
              publishedAt: res.sys.updatedAt,
            },
          };
          Object.entries(res.fields as Record<string, any>).forEach(([name, value]) => {
            if (typeof value === 'object') {
              if (value.sys?.type === 'Asset') {
                assetFieldNames.push(name);

                entry[name] = {
                  sys: value.sys,
                  title: value.fields?.title,
                  fileName: value.fields?.file?.filename,
                  url: value.fields?.file?.url,
                  size: value.fields?.file?.details.size,
                  width: value.fields?.file?.details.image?.width,
                  height: value.fields?.file?.details.image?.height,
                };
              } else {
                /* if field is RichText */
                if (value.nodeType === 'document') {
                  entry[name] = { json: value };
                }
              }
            } else {
              entry[name] = value;
            }
            if (entry.baseUrl && entry.slug) {
              entry = {
                ...entry,
                ...mapLink(entry.baseUrl, entry.slug),
              };
            }
          });
          return {
            templateName: res.sys.contentType.sys.id,
            companyLogo: (res.fields as any)?.logoUrl,
            data: entry,
          };
        });
        // console.log('items', items);

        return {
          items: items || [],
        } as ContentFeedData;
      }
    },
    {
      refetchInterval: props.refetchInterval,
      isDataEqual(prev, curr) {
        if (preview || prev?.items.length !== curr?.items.length) {
          return false;
        }
        const changed =
          (curr as TemplateData<any, any>)?.items.some(
            (item, i) => item.data.sys.publishedAt !== prev?.items[i].data.sys.publishedAt
          ) || false;
        // console.log('changed', changed);
        return !changed;
      },
    }
  );

  const { isLoading, error, data } = query;

  const providerValue = useMemo(
    () => ({
      isLoading,
      error,
      data,
    }),
    [data, error, isLoading]
  );

  return (
    <ContentFeedItemsContext.Provider value={providerValue}>
      {props.children}
    </ContentFeedItemsContext.Provider>
  );
};

function getAssetKeysFromMapping(mapping: Record<string, string>) {
  return Object.entries(mapping).reduce(
    (assetFields, [key, value]) =>
      value.split(':').pop() === 'Asset' ? [...assetFields, key] : assetFields,
    [] as string[]
  );
}

export const useContentFeedItems = () => useContext(ContentFeedItemsContext);
