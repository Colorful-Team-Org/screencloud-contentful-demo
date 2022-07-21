import { FullScreenImage, SplitLayoutContainer, theme } from '@screencloud/alfie-alpha';
import { FunctionComponent, ReactElement } from 'react';
import FullGrey from '../../../components/styling/FullGrey';
import { ContentfulHeroItem } from '../hero-layout-types';
import { HeroRightContent } from './HeroRightContent';

interface Props {
  itemDurationSeconds: number;
  companyLogoUrl?: string;
  item: ContentfulHeroItem;
  progressBarColor?: string;
  themedColor?: string;
  isPortrait: boolean;
}

export const HeroLayout: FunctionComponent<Props> = (props: Props): ReactElement<Props> => {
  const { itemDurationSeconds, companyLogoUrl, item, progressBarColor, isPortrait, themedColor } =
    props;

  const themeColor = themedColor || theme.colors.gray;

  return (
    <SplitLayoutContainer
      leftContentWidth={'50%'}
      rightContentWidth={'50%'}
      isPortrait={isPortrait}
      borderColor={themeColor}
      leftContent={
        <HeroRightContent
          itemDurationSeconds={itemDurationSeconds}
          item={item}
          companyLogoUrl={companyLogoUrl}
          progressBarColor={progressBarColor}
        />
      }
      rightContent={
        item.image?.url ? (
          <FullScreenImage
            url={item.image.url ? `${item.image.url}?w=2048` : ''}
            itemDurationSeconds={itemDurationSeconds}
          />
        ) : (
          <FullGrey />
        )
      }
    />
  );
};
