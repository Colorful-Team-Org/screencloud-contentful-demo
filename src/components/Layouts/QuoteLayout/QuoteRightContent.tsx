import React, { ReactElement, FunctionComponent } from "react";
import {
  ContentWrapper,
  Flex,
  theme,
  Text,
  TextSizes,
  Box,
} from "@screencloud/alfie-alpha";
import { ContentfulQuoteItem } from "../../../providers/ContentfulDataProvider";
import { RichText } from "../../RichText/rich-text";
import ImageAsset from "../../RichText/asset/image-asset";
import { QuoteAuthor } from "./QuoteAuthor";

interface Props {
  itemDurationSeconds: number;
  item: ContentfulQuoteItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const QuoteRightContent: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  console.log('QuoteRightContent', props);
  const { item } = props;

  return (
    <ContentWrapper backgroundColor={theme.colors.white}>
      <Flex flexDirection="column" justifyContent="center" flex={1}>
        <Flex
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          {!!item.text?.json && (
            <Text
              type={TextSizes.H4}
              wordBreak="break-word"
              fontFamily={"sans-serif"}
              textAlign={!!props.item.quoteCentered ? 'center' : undefined}
            >
              <RichText document={item.text.json} />
            </Text>
          )}

          {!!item.authorImage?.url && (
            <Box mt={100}>
              <QuoteAuthor {...item}/>
              {/* <ImageAsset {...item.authorImage} contentType="none" /> */}
            </Box>
          )}
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
