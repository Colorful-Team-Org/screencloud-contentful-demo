import { ContentfulCollection, useGqlQuery } from './contentful-api/contentful-graphql-service';

type SiteConfig = {
  logo: {
    url: string;
    width: number;
    height: number;
  };
};

export function useSiteConfig(preview?: boolean) {
  type QueryResponse = {
    siteConfigurationCollection: ContentfulCollection<SiteConfig>;
  };

  const siteConfigQuery = useGqlQuery<QueryResponse>(
    `query SiteConfig($locale: String, $preview: Boolean) {
    siteConfigurationCollection(limit: 10, locale: $locale, preview: $preview) {
      items {
        logo {
          url
          width height
        }
      }
    }
  }
  `,
    {
      input: { preview },
    }
  );

  // console.log(`siteConfigQuery`, siteConfigQuery);
  return siteConfigQuery.data?.siteConfigurationCollection.items[0];
}
