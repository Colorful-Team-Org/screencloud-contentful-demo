import {
  Box,
  ContentWrapper,
  Flex,
  Progress,
  Text,
  TextSizes,
  theme,
} from '@screencloud/alfie-alpha';
import { FunctionComponent, ReactElement } from 'react';
import { ContentfulQuoteItem } from '../../../providers/ContentfulDataProvider';
import { RichText } from '../../RichText/rich-text';
import { ReactComponent as QuoteSvg } from './assets/quote.svg';
import { QuoteAuthor } from './QuoteAuthor';

interface Props {
  itemDurationSeconds: number;
  item: ContentfulQuoteItem;
  showAuthorImage?: boolean;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

export const QuoteRightContent: FunctionComponent<Props> = (props: Props): ReactElement<Props> => {
  // console.log('QuoteRightContent', props);
  const { item, showAuthorImage, itemDurationSeconds, progressBarColor } = props;
  const { author, authorImage, authorLocation } = item;

  const textCentered = showAuthorImage || !!props.item.quoteCentered;
  return (
    <ContentWrapper backgroundColor={theme.colors.white}>
      <Flex padding={[0, 28]} flexDirection="column" justifyContent="space-between" height="100%">
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
                textAlign={textCentered ? 'center' : undefined}
              >
                <RichText document={item.text.json} />
              </Text>
            </>
          )}
          {!!item.author && (
            <Box mt={40}>
              <QuoteAuthor
                author={author}
                authorImage={!!showAuthorImage ? authorImage : undefined}
                authorLocation={authorLocation}
                centered={!!showAuthorImage || item.quoteCentered}
              />
            </Box>
          )}
        </Flex>

        <div>
          <Box width="200px">
            <Progress duration={itemDurationSeconds} barColor={progressBarColor} />
          </Box>
        </div>

        {/* </Flex> */}
      </Flex>
    </ContentWrapper>
  );
};
