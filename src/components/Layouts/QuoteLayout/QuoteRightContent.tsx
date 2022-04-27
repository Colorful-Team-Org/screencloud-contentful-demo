import React, { ReactElement, FunctionComponent } from "react";
import {
  ContentWrapper,
  Flex,
  theme,
  Text,
  TextSizes,
} from "@screencloud/alfie-alpha";
import { ContentfulQuoteItem } from "../../../providers/ContentfulDataProvider";
import { RichText } from "../../RichText/rich-text";

interface Props {
  itemDurationSeconds: number;
  item: ContentfulQuoteItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const QuoteRightContent: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
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
          {item.text?.json && (
            <Text
              type={TextSizes.H4}
              wordBreak="break-word"
              fontFamily={"sans-serif"}
              textAlign={!!props.item.quoteCentered ? 'center' : undefined}
            >
              <RichText document={item.text.json} />
            </Text>
          )}
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
