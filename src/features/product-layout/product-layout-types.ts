import * as types from '@contentful/rich-text-types';
import { ContentfulItem } from '../../providers/ContentfulDataProvider';
import { ImageAsset } from '../../service/schema-connector/content-mapping-service';

export interface ContentfulProductItem extends ContentfulItem {
  id: string;
  brand: string;
  price: number;
  comparePrice: number;
  type: string;
  description?: string | { json: types.Document };
  image?: ImageAsset;
  name: string;
  link?: string;
}

export const PRODUCT_TEMPLATE_NAME = 'products' as const;
