import React, { FunctionComponent } from 'react';
import { theme, SplitLayoutContainer, FullScreenImage } from '@screencloud/alfie-alpha';
import { BlogPostRightContent } from './BlogPostRightContent';
import FullGrey from '../../../components/styling/FullGrey';
import { ContentfulBlogItem } from '../blog-layout-types';
import { ImagePlaceholder } from '../../../components/ImagePlaceholder';

interface Props {
  itemDurationSeconds: number;
  companyLogoUrl?: string;
  item: ContentfulBlogItem;
  progressBarColor?: string;
  themedColor?: string;
  isPortrait: boolean;
  updatedAt?: string;
}

export const BlogPostLayout: FunctionComponent<Props> = (props: Props) => {
  // console.log(`BlogPostLayout()`);
  const { itemDurationSeconds, companyLogoUrl, item, progressBarColor, isPortrait, themedColor } =
    props;

  const themeColor = themedColor || theme.colors.gray;

  return (
    <SplitLayoutContainer
      leftContentWidth={'50'}
      rightContentWidth={'50'}
      isPortrait={isPortrait}
      borderColor={themeColor}
      leftContent={
        item.image?.url ? (
          <FullScreenImage
            url={item.image?.url ? `${item.image?.url}?w=2048` : ''}
            itemDurationSeconds={itemDurationSeconds}
          />
        ) : (
          <ImagePlaceholder  />
        )
      }
      rightContent={
        <BlogPostRightContent
          itemDurationSeconds={itemDurationSeconds}
          item={item}
          companyLogoUrl={companyLogoUrl}
          progressBarColor={progressBarColor}
        />
      }
    />
  );
};
