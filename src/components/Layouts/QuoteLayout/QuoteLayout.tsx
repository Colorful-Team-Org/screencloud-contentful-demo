import React, { ReactElement, FunctionComponent, useMemo } from 'react';
import { theme, SplitLayoutContainer, FullScreenImage } from '@screencloud/alfie-alpha';
import { QuoteRightContent } from './QuoteRightContent';
import { ContentfulQuoteItem } from '../../../providers/ContentfulDataProvider';

interface Props {
  itemDurationSeconds: number;
  companyLogoUrl?: string;
  item: ContentfulQuoteItem;
  progressBarColor?: string;
  themedColor?: string;
  isPortrait: boolean;
}

export const QuoteLayout: FunctionComponent<Props> = (props: Props): ReactElement<Props> => {
  const { itemDurationSeconds, companyLogoUrl, item, progressBarColor, isPortrait, themedColor } =
    props;
  // console.log(`QuoteLayout`, props)

  const themeColor = themedColor || theme.colors.gray;

  const imageContent = useMemo(() => {
    const url = item.image?.url;
    if (!url) return undefined;

    return <FullScreenImage url={`${url}?w=2048`} itemDurationSeconds={itemDurationSeconds} />;
  }, [item.image?.url, itemDurationSeconds]);

  const textContent = useMemo(
    () => (
      <QuoteRightContent
        key={item.sys.id}
        item={item}
        itemDurationSeconds={itemDurationSeconds}
        companyLogoUrl={companyLogoUrl}
        progressBarColor={progressBarColor}
      />
    ),
    [companyLogoUrl, item, itemDurationSeconds, progressBarColor]
  );

  return (
    <>
      {!!imageContent ? (
        <SplitLayoutContainer
          leftContentWidth={'50'}
          rightContentWidth={'50'}
          isPortrait={isPortrait}
          borderColor={themeColor}
          // leftContent={!!item.imageLeftAligned ? imageContent : textContent}
          // rightContent={!!item.imageLeftAligned ? textContent : imageContent}
          leftContent={imageContent}
          rightContent={textContent}
        />
      ) : (
        textContent
      )}
    </>
  );
};
