import * as types from '@contentful/rich-text-types';
import { ContentfulItem } from '../../providers/ContentfulDataProvider';
import { ImageAsset } from '../../service/schema-connector/content-mapping-service';
export interface ContentfulBlogItem extends ContentfulItem {
  title: string;
  link: string;
  description?: { json: types.Document };
  category?: string;
  author: string;
  image?: ImageAsset;
  pubDate?: string;
  companyLogo?: string;
}

export const BLOG_TEMPLATE_NAME = 'blog' as const;
