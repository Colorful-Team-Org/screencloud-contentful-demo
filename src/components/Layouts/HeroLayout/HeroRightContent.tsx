import {
  Box,
  ContentWrapper,
  Flex,
  Logo,
  Progress,
  QRCode,
  Text,
  TextSizes,
  theme,
} from '@screencloud/alfie-alpha';
import { FunctionComponent, ReactElement, useEffect, useMemo, useState } from 'react';
import { ContentfulHeroItem } from '../../../providers/ContentfulDataProvider';

interface Props {
  itemDurationSeconds: number;
  item: ContentfulHeroItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const HeroRightContent: FunctionComponent<Props> = (props: Props): ReactElement<Props> => {
  // console.log(`props`, props)
  const { item, itemDurationSeconds, progressBarColor, companyLogoUrl } = props;

  // const color = useMemo(
  //   () =>
  //     item.color?.match(/(#[0-9a-f]{6}|#[0-9a-f]{3})/gi)?.[0]?.toUpperCase() || theme.colors.white,
  //   [item]
  // );

  /** Will always be 'white' (currently we ignore the contentTypes color setting)  */
  const color = theme.colors.white;

  const isDark = useMemo(() => {
    switch (color) {
      case '#000000':
      case '#000':
      case '#797979':
      case '#BBBBBB':
        return true;
    }
    return false;
  }, [color]);

  const textColor = useMemo(() => (isDark ? theme.colors.white : theme.colors.black), [isDark]);

  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [item]);

  return (
    <ContentWrapper key={key} backgroundColor={color} p={0} width="100%" height="100%">
      <Flex
        overflow="hidden"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        padding={[40, 68]}
      >
        <Box style={{ background: isDark ? theme.colors.white : 'transparent' }}>
          {companyLogoUrl && <Logo url={companyLogoUrl} maxHeight={'160px'} maxWidth={'200px'} />}
        </Box>

        <Box>
          {item.headline && (
            <Text
              type={TextSizes.H4}
              color={textColor}
              wordBreak="break-word"
              fontFamily={'sans-serif'}
              fontWeight={theme.fontWeights.black}
              paddingBottom={{ _: 4, lg: 7 }}
            >
              {item.headline}
            </Text>
          )}
        </Box>

        <Flex width={'100%'} justifyContent={'space-between'} alignItems={'flex-end'}>
          {item.link && <QRCode size={114} url={item.link} />}
          <Box width={'33%'}>
            <Progress duration={itemDurationSeconds} barColor={progressBarColor} />
          </Box>
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
