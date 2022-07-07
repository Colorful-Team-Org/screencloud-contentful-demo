import * as types from '@contentful/rich-text-types';
import { ContentfulItem } from '../../providers/ContentfulDataProvider';
import { ImageAsset } from '../../service/schema-connector/content-mapping-service';

export interface ContentfulHeroItem extends ContentfulItem {
  headline: string;
  image?: ImageAsset;
  paragraph?: { json: types.Document };
  link?: string;
  color: string;
}

export const HERO_TEMPLATE_NAME = 'heroes' as const;
