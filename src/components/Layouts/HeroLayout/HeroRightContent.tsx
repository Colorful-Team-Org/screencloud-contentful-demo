import React, {
  ReactElement,
  FunctionComponent,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  ContentWrapper,
  Flex,
  theme,
  Text,
  TextSizes,
  QRCode,
  Logo,
  Box,
} from "@screencloud/alfie-alpha";
import { ContentfulHeroItem } from "../../../providers/ContentfulDataProvider";

interface Props {
  itemDurationSeconds: number;
  item: ContentfulHeroItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const HeroRightContent: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  // console.log(`props`, props)
  const { item, companyLogoUrl } = props;

  const color = useMemo(() => (
    item.color?.match(/(#[0-9a-f]{6}|#[0-9a-f]{3})/gi)?.[0]?.toUpperCase() || theme.colors.white
  ), [item])

  const isDark = useMemo(() => {
    switch(color) {
      case '#000000':
      case '#000':
      case '#797979':
      case '#BBBBBB':
        return true;
    }
    return false;
  }, [color])

  const textColor = useMemo(() => isDark ? theme.colors.white : theme.colors.black, [isDark]);

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
      >
        <Box p={5} style={{ background: isDark ? theme.colors.white : 'transparent' }}>
          {companyLogoUrl && (
            <Logo url={companyLogoUrl} maxHeight={"160px"} maxWidth={"200px"} />
          )}
        </Box>

        <Box px={5}>
          {item.headline && (
            <Text
              type={TextSizes.H4}
              color={textColor}
              wordBreak="break-word"
              fontFamily={"sans-serif"}
              fontWeight={theme.fontWeights.black}
              paddingBottom={{ _: 4, lg: 7 }}
            >
              {item.headline}
            </Text>
          )}
        </Box>

        <Box mb={5} style={{ textAlign: 'center'}}>
          {item.link && (
            <Box
              style={{ display: 'inline-block'}} background={theme.colors.white} p={1}>
              <QRCode url={item.link} />
            </Box>
          )}
        </Box>
      </Flex>
    </ContentWrapper>
  );
};
