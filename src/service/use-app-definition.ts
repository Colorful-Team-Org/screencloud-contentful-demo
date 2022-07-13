import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import { SchemaDefinition } from './schema-connector/schema-connector.types';

export const APP_DEF_URL = `/data/screencloud-app-definitions.json`;

export function fetchAppDefinition() {
  return fetch(APP_DEF_URL).then(response => response.json() as Promise<SchemaDefinition[]>);
}
export function useAppDefinitionsQuery(options?: UseQueryOptions<any>) {
  return useQuery<SchemaDefinition[]>(APP_DEF_URL, fetchAppDefinition, options);
}

export function useAppDefinitionByNameQuery(name?: string, options?: UseQueryOptions<any>) {
  const query = useAppDefinitionsQuery({ ...options, enabled: options?.enabled && !!name });
  const appDefinition = useMemo(() => query.data?.find(d => d.name === name), [name, query.data]);
  return {
    ...query,
    data: appDefinition,
  };
}
