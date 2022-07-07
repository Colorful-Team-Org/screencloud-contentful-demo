import React, { FunctionComponent, useContext, useMemo } from 'react';
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
import {
  useContentFeedQuery,
  useMappedData,
} from '../service/schema-connector/content-mapping-service';

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
  refetchInterval?: number;
};

export const ContentfulDataProvider: FunctionComponent<Props> = props => {
  const contentFeedQuery = useContentFeedQuery({
    skip: !props.contentFeedId,
    id: props.contentFeedId!,
    refetchInterval: props.refetchInterval,
  });
  const contentFeed = contentFeedQuery.data?.contentFeed;
  // useEffect(() => {
  //   if (contentFeed) {
  //     console.group(`Contentful Content feed`);
  //     console.log(contentFeed);
  //     console.groupEnd();
  //   }
  // }, [contentFeed])

  const mappingConfig = contentFeed?.contentMappingConfig.config;
  const itemIds = contentFeed?.entriesCollection.items;

  const assetFieldNames = useMemo(() => {
    if (!mappingConfig?.mapping) return [];
    return getAssetKeysFromMapping(mappingConfig.mapping);
  }, [mappingConfig?.mapping]);

  const { queryResponse, items = [] } = useMappedData(mappingConfig, {
    filterItems: itemIds,
    refetchInterval: props.refetchInterval,
  });

  const isLoading = contentFeedQuery.isLoading || queryResponse.isLoading;

  let error: any =
    contentFeed === null ? `There is no ContentFeed with id "${props.contentFeedId}"` : undefined;
  if (!error) error = contentFeedQuery.error || queryResponse.error;

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
