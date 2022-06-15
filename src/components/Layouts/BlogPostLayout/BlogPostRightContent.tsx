import {
  Box,
  ContentWrapper,
  Flex,
  Progress,
  QRCode,
  Text,
  TextSizes,
  theme,
} from '@screencloud/alfie-alpha';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import format from 'date-fns/format';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { customColors } from '../../../custom-theme';
import { ContentfulBlogItem } from '../../../providers/ContentfulDataProvider';
import { RichText } from '../../RichText/rich-text';

interface Props {
  itemDurationSeconds: number;
  item: ContentfulBlogItem;
  companyLogoUrl?: string;
  progressBarColor?: string;
}

const getPublishedTime = (publishedDate: string): string => {
  const now = new Date();
  const published = new Date(publishedDate);
  const differenceDays = differenceInDays(now, published);
  if (differenceDays < 0) {
    const differenceHours = differenceInHours(now, published);
    if (differenceHours < 0) {
      const differenceMinutes = differenceInMinutes(now, published);
      if (differenceMinutes < 0) {
        const differenceSeconds = differenceInSeconds(now, published);
        return `${differenceSeconds} seconds ago`;
      }
      return `${differenceMinutes} minutes ago`;
    }
    return `${differenceHours} hours ago`;
  }
  if (differenceDays > 30) {
    return format(published, 'LLLL dd, yyyy');
  }
  return `${differenceDays} days ago`;
};

export const BlogPostRightContent: FunctionComponent<Props> = props => {
  const { itemDurationSeconds, item, progressBarColor, companyLogoUrl } = props;

  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setKey(Date.now());
  }, [item]);

  const footer = useMemo(() => {
    const string = [item.author, item.pubDate && getPublishedTime(item.pubDate)]
      .filter(f => !!f)
      .join(` • `);

    return string ? `By ${string}` : undefined;
  }, [item.author, item.pubDate]);

  const itemDescriptionJson = item.description?.json;
  return (
    <ContentWrapper backgroundColor={theme.colors.white} key={key}>
      <Flex
        overflow="hidden"
        flexDirection="column"
        justifyContent="stretch"
        height="100%"
        padding={[0, 28]}
      >
        {/* Category and Logo */}
        <Flex justifyContent="space-between" alignItems="center">
          {/* Category */}
          {item.category && (
            <Text
              type={TextSizes.H4}
              color={customColors.lightGray}
              wordBreak="break-word"
              fontFamily={'sans-serif'}
              // fontWeight={theme.fontWeights.black}
            >
              {item.category}
            </Text>
          )}
          {companyLogoUrl && (
            <Box width="33%">
              <img src={companyLogoUrl} style={{ maxWidth: 200 }} alt="" />
            </Box>
          )}
        </Flex>

        <Flex
          flexGrow={1}
          flexDirection="column"
          height="100%"
          // justifyContent={!!itemDescriptionJson ? 'center' : 'flex-start'}
          justifyContent="center"
          alignItems="left"
        >
          {/* Headline */}
          <Text
            type={TextSizes.H3}
            color={theme.colors.black}
            wordBreak="break-word"
            fontFamily={'sans-serif'}
            fontWeight={theme.fontWeights.black}
            paddingBottom={{ _: 4, lg: 7 }}
          >
            {item.title}
          </Text>

          {/* Paragraph */}
          <Text
            type={TextSizes.SmallP}
            wordBreak="break-word"
            fontFamily={'sans-serif'}
            paddingBottom={{ _: 2, lg: 7 }}
          >
            {itemDescriptionJson && <RichText document={itemDescriptionJson} />}
          </Text>

          {footer && (
            <Text
              type={TextSizes.SmallP}
              color={customColors.lightGray}
              wordBreak="break-word"
              fontFamily={'sans-serif'}
              // paddingBottom={{ _: 4, lg: 7 }}
            >
              {footer}
            </Text>
          )}
        </Flex>

        <Flex width={'100%'} justifyContent={'space-between'} alignItems={'flex-end'}>
          <Box width={'33%'}>
            <Progress duration={itemDurationSeconds} barColor={progressBarColor} />
          </Box>
          {item.link && <QRCode size={114} url={item.link} />}
        </Flex>
      </Flex>
    </ContentWrapper>
  );
};
