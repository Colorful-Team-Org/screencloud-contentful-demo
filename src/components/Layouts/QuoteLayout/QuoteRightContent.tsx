import { Box, ContentWrapper, Flex, Progress, Text, TextSizes, theme } from '@screencloud/alfie-alpha';
import React, { FunctionComponent, ReactElement } from 'react';
import { ContentfulQuoteItem } from '../../../providers/ContentfulDataProvider';
import { RichText } from '../../RichText/rich-text';
import { QuoteAuthor } from './QuoteAuthor';
import { ReactComponent as QuoteSvg } from './assets/quote.svg';

interface Props {
  itemDurationSeconds: number;
  item: ContentfulQuoteItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const QuoteRightContent: FunctionComponent<Props> = (props: Props): ReactElement<Props> => {
  console.log('QuoteRightContent', props);
  const { item, itemDurationSeconds, progressBarColor } = props;

  return (
    <ContentWrapper backgroundColor={theme.colors.white}>
      <Flex padding={[0, 28]} flexDirection="column" justifyContent="stretch" height="100%">
        {/* <Flex flexDirection="row" flexWrap="wrap" justifyContent="center" alignItems="center"> */}
        <Flex flex={1} flexDirection="column" justifyContent="center">
          {!!item.text?.json && (
            <>
              <Box marginBottom={50}>
                <QuoteSvg width={76} />
              </Box>
              <Text
                type={TextSizes.H4}
                wordBreak="break-word"
                fontFamily={'sans-serif'}
                textAlign={!!props.item.quoteCentered ? 'center' : undefined}
              >
                <RichText document={item.text.json} />
              </Text>
            </>
          )}
          {!!item.authorImage?.url && (
            <Box mt={40}>
              <QuoteAuthor author={item.author} centered={item.quoteCentered} />
            </Box>
          )}
        </Flex>

        <div>
        <Box width={'33%'}>
            <Progress duration={itemDurationSeconds} barColor={progressBarColor} />
          </Box>
        </div>

        {/* </Flex> */}
      </Flex>
    </ContentWrapper>
  );
};
