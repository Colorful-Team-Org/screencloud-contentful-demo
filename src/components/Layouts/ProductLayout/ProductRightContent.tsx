import React, {
  ReactElement,
  FunctionComponent,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  Box,
  ContentWrapper,
  Flex,
  theme,
  Text,
  TextSizes,
  Logo,
  QRCode,
  Progress,
} from "@screencloud/alfie-alpha";
import { ContentfulProductItem } from "../../../providers/ContentfulDataProvider";
import { RichText } from "../../RichText/rich-text";

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
        fontFamily={"sans-serif"}
        paddingBottom={{ _: 2, lg: 7 }}
      >
        {typeof item.description === 'string' ? item.description : (
          !!item.description.json ? (
            <RichText document={item.description.json} />
          ) : (
            ''
          )
        )}
      </Text>
    )
  }, [item.description])

  return (
    <ContentWrapper backgroundColor={theme.colors.white} key={key}>
      <Flex
        overflow="hidden"
        flexDirection="column"
        justifyContent="center"
        height="100%"
      >
        {/* Brand & product type */}
        <Flex
          overflow="hidden"
          flexDirection="row"
          justifyContent="left"
          alignItems="flex-start"
          width="100%"
        >
          <Flex flex="1" alignSelf="flex-end" flexDirection="column">
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
            <Logo url={companyLogoUrl} maxHeight={"160px"} maxWidth={"150px"} />
          )}
        </Flex>

        {/* middle */}
        <Flex flex="1" flexDirection="column" alignItems="center" justifyContent="center">
          {/* description */}
          <Flex
            overflow="hidden"
            flexDirection="column"
            justifyContent="left"
            width="100%"
          >
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
            {!!description && (
              <Box mt={4}>
                {description}
              </Box>
            )}
          </Flex>

          {/* product ID */}
          <Flex
            overflow="hidden"
            flexDirection="row"
            justifyContent="left"
            width="100%"
            paddingBottom={{ _: 4, lg: 7 }}
          >
            <Text
              type={TextSizes.SmallP}
              color="#777"
              wordBreak="break-word"
              fontFamily={theme.fonts.normal}
              fontWeight={theme.fontWeights.normal}
            >
              {item.id}
            </Text>
          </Flex>

          {/* price */}
          {!!item.price && (
            <Flex
              justifyContent="left"
              alignItems="end"
              width="100%"
            >
              {item.comparePrice && item.comparePrice !== item.price && (
                <Text
                  type={TextSizes.H2}
                  wordBreak="break-word"
                  fontFamily={theme.fonts.normal}
                  fontWeight={theme.fontWeights.bold}
                  color="#777"
                  style={{ textDecoration: 'line-through', marginRight: 40 }}
                >
                  {item.comparePrice} €
                </Text>
              )}
              <Text
                type={TextSizes.H1}
                wordBreak="break-word"
                fontFamily={theme.fonts.normal}
                fontWeight={theme.fontWeights.bold}
                color="#2d313b"
              >
                {item.price} €
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          flexDirection="row"
        >
          <Flex
            width="100%"
            height="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box width={"33%"}>
              <Progress
                duration={itemDurationSeconds}
                barColor={progressBarColor}
              />
            </Box>
          </Flex>
          {item.link && (
            <QRCode url={item.link} />
          )}
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
