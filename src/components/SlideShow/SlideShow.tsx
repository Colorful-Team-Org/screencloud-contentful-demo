import { DEFAULT_ITEM_DELAY_SECONDS } from '@screencloud/alfie-alpha';
import React, { useMemo, useState } from 'react';
import { BlogPostLayout } from '../../features/blog-layout/components/BlogPostLayout';
import { HeroLayout } from '../../features/hero-layout/components/HeroLayout';
import { ProductLayout } from '../../features/product-layout/components/ProductLayout';
import { QuoteLayout } from '../../features/quote-layout/components/QuoteLayout';
import { useScreenCloudPlayer } from '../../features/sc-player/ScreenCloudPlayerProvider';
import useTimeout from '../../hooks/useTimeout';
import { ContentFeedData } from '../../providers/ContentFeedProvider';
import { NotificationSlide } from './NotificationSlide';

const ITEM_DELAY_SECONDS = DEFAULT_ITEM_DELAY_SECONDS;
// const ITEM_DELAY_SECONDS = 60 * 60 * 24;
// const ITEM_DELAY_SECONDS = 3;

/** Maps TemplateNames to the corresponding render component. */
const components = {
  blog: React.memo(BlogPostLayout),
  quotes: React.memo(QuoteLayout),
  products: React.memo(ProductLayout),
  heroes: React.memo(HeroLayout),
} as const;

type Props = {
  data?: ContentFeedData;
};

export const SlideShow = (props: Props) => {
  const { data } = props;
  // console.log(`SlideShow()`, props);

  const { config: screencloudConfig } = useScreenCloudPlayer();
  const slideSeconds = useMemo(() => {
    if (!screencloudConfig?.slideDuration) return ITEM_DELAY_SECONDS;
    return screencloudConfig?.slideDuration / 1000;
  }, [screencloudConfig?.slideDuration]);

  const themedColor = '';
  const isPortrait = false;
  const items = data?.items;

  /** All image urls of items[] (for preloading). */
  const imgSrcs = useMemo(() => {
    if (!items) return [];

    const imgSrcs = new Set<string>();
    items.forEach((item: any) => {
      item.assetFieldNames?.forEach((assetKey: any) => {
        const fileName = (item.data as any)[assetKey]?.fileName;
        if (!fileName) return;

        const fileExt = String(fileName).toLowerCase().split(`.`).pop();
        if (!fileExt) return;

        if (fileExt && ['jpg', 'jpeg', 'png'].includes(fileExt)) {
          imgSrcs.add(fileName);
        }
      });
    });
    return Array.from(imgSrcs);
  }, [items]);
  // console.log('imgSrcs', imgSrcs);

  /** preloading all image sources */
  useMemo(
    () =>
      imgSrcs?.map(src => {
        const image = new Image();
        image.src = src;
        return image;
      }),
    [imgSrcs]
  );

  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Loop over each item in feed, once all items have been displayed loop back to the start
  useTimeout(
    () => {
      if (items) {
        if (currentItemIndex === items.length - 1) {
          setCurrentItemIndex(0);
        } else {
          setCurrentItemIndex(currentItemIndex + 1);
        }
      }
    },
    slideSeconds * 1000,
    !!items?.length
  );

  // if (!items?.length) {
  //   return <>No stuff</>
  // }

  const item = items?.[currentItemIndex];
  const Comp = item?.templateName ? components[item.templateName] : undefined;
  // console.log({ item, Comp });

  if (item?.templateName && !Comp) {
    return <NotificationSlide title="Content type for this entry is not supported." />;
  }

  return item && Comp ? (
    <Comp
      itemDurationSeconds={slideSeconds}
      item={item.data as any}
      isPortrait={isPortrait}
      companyLogoUrl={item.companyLogo}
      themedColor={themedColor}
    />
  ) : (
    <></>
  );
};
