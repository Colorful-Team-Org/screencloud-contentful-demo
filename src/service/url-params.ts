import { AppConfig } from '../app-types';
import { parseSearch } from '../utils/url-utils';

const urlVars = ['space-id', 'api-key', 'contentfeed', 'locale', 'preview'];

export function configFromUrlParams(searchParams: URLSearchParams, currentConfig?: AppConfig) {
  const params = parseSearch(searchParams);
  if (urlVars.some(k => k in params)) {
    let config = currentConfig
      ? { ...currentConfig }
      : { spaceId: '', apiKey: '', contentFeed: '' };
    if (params['space-id']) config.spaceId = params['space-id'];
    if (params['api-key']) config.apiKey = params['api-key'];
    if (params['contentfeed']) config.contentFeed = params['contentfeed'];
    if (params['locale']) config.locale = params['locale'];
    if (params['preview']) config.preview = params['preview'] === '1';
    if (params['slide-duration']) config.slideDuration = parseInt(params['slide-duration']);

    return config;
  }
  return currentConfig;
}

export function urlParamsFrom(config: AppConfig) {
  let string = `space-id=${config.spaceId}&api-key=${config.apiKey}&contentfeed=${config.contentFeed}`;
  if (config.locale) {
    string += `&locale=${config.locale}`;
  }
  if (config.preview) {
    string += `&preview=1`;
  }
  if (config.slideDuration) {
    string += `&slide-duration=${config.slideDuration}`;
  }
  return string;
}
