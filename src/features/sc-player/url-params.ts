import { AppConfig } from '../../app-types';
import { parseSearch } from '../../utils/url-utils';
import { PlayerConfig } from './ScreenCloudPlayerProvider';

const urlVars = ['space-id', 'api-key', 'app-definition-name', 'contentfeed', 'locale', 'preview'];

export function configFromUrlParams(searchParams: URLSearchParams, currentConfig?: PlayerConfig) {
  const params = parseSearch(searchParams);
  if (urlVars.some(k => k in params)) {
    const isPreview = params['preview'] === '1';

    let config = currentConfig
      ? { ...currentConfig }
      : { spaceId: '', apiKey: '', contentFeed: '' };
    if (params['space-id']) config.spaceId = params['space-id'];
    if (params['api-key']) config.apiKey = params['api-key'];
    if (params['contentfeed']) config.contentFeed = params['contentfeed'];
    if (params['app-definition-name']) config.appDefinitionName = params['app-definition-name'];
    if (params['locale']) config.locale = params['locale'];
    if (params['preview']) config.preview = isPreview;
    if (params['slide-duration']) config.slideDuration = parseInt(params['slide-duration']);

    return config;
  }
  return currentConfig;
}

export function urlParamsFrom(config: AppConfig) {
  const apiKey = config.preview ? config.previewApiKey : config.apiKey;
  let string = `space-id=${config.spaceId}&api-key=${apiKey}&contentfeed=${config.contentFeed}`;
  if (config.locale) {
    string += `&locale=${config.locale}`;
  }
  if (config.appDefinitionName) {
    string += `&app-definition-name=${config.appDefinitionName}`;
  }
  if (config.preview) {
    string += `&preview=1`;
  }
  if (config.slideDuration) {
    string += `&slide-duration=${config.slideDuration}`;
  }
  return string;
}
