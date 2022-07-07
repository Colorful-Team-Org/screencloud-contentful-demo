import * as types from '@contentful/rich-text-types';
import { ContentfulItem } from '../../providers/ContentfulDataProvider';
import { ImageAsset } from '../../service/schema-connector/content-mapping-service';

export interface ContentfulQuoteItem extends ContentfulItem {
  image?: ImageAsset;
  text: { json: types.Document };
  author: string;
  authorImage: ImageAsset;
  authorLocation?: string;
  imageLeftAligned?: boolean;
  quoteCentered?: boolean;
}

export const QUOTE_TEMPLATE_NAME = 'quotes' as const;
