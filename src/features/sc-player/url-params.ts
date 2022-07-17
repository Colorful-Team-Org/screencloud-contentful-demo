import { AppConfig } from '../../app-types';
import { parseSearch } from '../../utils/url-utils';
import { PlayerConfig } from './ScreenCloudPlayerProvider';


export function configFromUrlParams(searchParams: URLSearchParams, currentConfig?: PlayerConfig) {
  const params = parseSearch(searchParams);
  return {
    ...currentConfig,
    ...(params['config'] ? JSON.parse(params['config']) : {}),
  };
}

export function urlParamsFrom(config: AppConfig) {
  return `config=${JSON.stringify(config)}`;
}
