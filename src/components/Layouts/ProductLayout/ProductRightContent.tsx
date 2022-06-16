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
import { ContentfulProductItem } from '../../../providers/ContentfulDataProvider';
import { RichText } from '../../RichText/rich-text';

interface Props {
  itemDurationSeconds: number;
  item: ContentfulProductItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const ProductRightContent: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const { item, companyLogoUrl, itemDurationSeconds, progressBarColor } = props;
  // console.log('ProductRightContent',  props);

  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [item]);

  const description = useMemo(() => {
    if (!item.description) return;
    return (
      <Text
        type={TextSizes.SmallP}
        wordBreak="break-word"
        fontFamily={'sans-serif'}
        paddingBottom={{ _: 2, lg: 7 }}
      >
        {typeof item.description === 'string' ? (
          item.description
        ) : !!item.description.json ? (
          <RichText document={item.description.json} />
        ) : (
          ''
        )}
      </Text>
    );
  }, [item.description]);

  return (
    <ContentWrapper backgroundColor={theme.colors.white} key={key}>
      <Flex
        padding={[0, 32]}
        overflow="hidden"
        flexDirection="column"
        justifyContent="center"
        height="100%"
      >
        {/* Brand & product type */}
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            {item.brand && (
              <Text
                type={TextSizes.H3}
                color={theme.colors.black}
                wordBreak="break-word"
                fontFamily={theme.fonts.normal}
                fontWeight={theme.fontWeights.bold}
              >
                {item.brand}
              </Text>
            )}
            {item.type && (
              <Text
                type={TextSizes.SmallP}
                color="#777"
                wordBreak="break-word"
                fontFamily={theme.fonts.normal}
                fontWeight={theme.fontWeights.normal}
              >
                {item.type}
              </Text>
            )}
          </Flex>
          {companyLogoUrl && (
            <Box width="33%" style={{ textAlign: 'right' }}>
              <img src={companyLogoUrl} style={{ width: '100%', maxWidth: 200 }} alt="Logo" />
            </Box>
          )}
        </Flex>

        {/* middle */}
        <Flex flex="1" flexDirection="column" alignItems="center" justifyContent="center">
          {/* description */}
          <Flex overflow="hidden" flexDirection="column" justifyContent="left" width="100%">
            {item.name && (
              <Text
                type={TextSizes.H3}
                color="#2d313b"
                wordBreak="break-word"
                fontFamily={theme.fonts.normal}
                fontWeight={theme.fontWeights.black}
              >
                {item.name.toUpperCase()}
              </Text>
            )}
            {!!description && <Box mt={4}>{description}</Box>}

            {/* product ID */}
            {!!item.id && (
              <Text
                type={TextSizes.SmallP}
                color="#999"
                wordBreak="break-word"
                fontFamily={theme.fonts.normal}
                fontWeight={theme.fontWeights.normal}
                style={{ marginTop: `1.5rem` }}
              >
                {item.id}
              </Text>
            )}
          </Flex>

          {/* price */}
          {!!item.price && (
            <Flex mt={3} justifyContent="left" alignItems="end" width="100%">
              <Text
                type={TextSizes.H3}
                wordBreak="break-word"
                fontFamily={theme.fonts.normal}
                fontWeight={theme.fontWeights.bold}
                color="#2d313b"
              >
                {item.price} €
              </Text>
              {item.comparePrice && item.comparePrice !== item.price && (
                <Text
                  // type={TextSizes.H4}
                  wordBreak="break-word"
                  fontFamily={theme.fonts.normal}
                  fontWeight={theme.fontWeights.bold}
                  color="#999"
                  style={{ marginLeft: 25 }}
                >
                  {item.comparePrice} €
                </Text>
              )}
            </Flex>
          )}
        </Flex>
        <Flex
          width={'100%'}
          justifyContent={'space-between'}
          alignItems={'flex-end'}
          flexDirection="row"
        >
          <Flex width="100%" height="100%" justifyContent="space-between" alignItems="end">
            <Box width={225}>
              <Progress duration={itemDurationSeconds} barColor={progressBarColor} />
            </Box>
          </Flex>
          {item.link && (
            <Box>
              <QRCode url={item.link} />
            </Box>
          )}
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
