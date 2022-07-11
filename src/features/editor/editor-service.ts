import { useQuery } from 'react-query';
import { gqlRequest } from '../../service/contentful-api/contentful-graphql-service';
import { QueryTypeFieldsGql } from '../../service/contentful-api/contentful-querries';

export function useContentFeedQuery(spaceId: string, apiKey: string, preview = false) {
  return useQuery<any, any, { name: string; id: string }[]>(
    ['contentfeeds', spaceId, apiKey, preview],
    async () => {
      try {
        const response = await gqlRequest<any>(
          spaceId!,
          apiKey!,
          `{ contentFeedCollection(preview: ${String(!!preview)}) { items { name sys { id } } } }`
        );
        console.log(`response`, response);
        return (
          response.contentFeedCollection.items.map((item: any) => ({
            name: item.name,
            id: item.sys.id,
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
    { enabled: options?.enabled && !!spaceId && !!apiKey, retry: false }
  );
}
