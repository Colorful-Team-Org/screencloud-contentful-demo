import { Box, Flex, Text } from '@screencloud/alfie-alpha';
import React, { CSSProperties, FunctionComponent } from 'react';
import { ImageAsset } from '../../../service/schema-connector/content-mapping-service';
import styles from './QuoteAuthor.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  author: string;
  authorImage?: ImageAsset;
  authorLocation?: string;
  centered?: boolean;
  className?: string;
  style?: CSSProperties;
};
export const QuoteAuthor: FunctionComponent<Props> = props => {
  const { author, authorImage, authorLocation, centered, ...divProps } = props;
  return (
    <div {...divProps}>
      <Box id="test" display="flex" flexDirection="column">
        {!!authorImage && (
          <Box mb={4} mx={!!centered ? 'auto' : undefined}>
            <img
              className={styles.authorImage}
              src={authorImage.url}
              alt={authorImage.description}
            />
          </Box>
        )}
        {!!author && (
          <Flex alignItems="baseline" alignSelf={!!centered ? 'center' : undefined}>
            <Box>
              <Box
                display="inline-block"
                width={24}
                height={2}
                marginRight={20}
                marginBottom="2px"
                background="black"
              />
            </Box>
            <Box display="inline-block">
              <Text fontWeight="bold">{author}</Text>
              {!!authorLocation && <Text>, {authorLocation}</Text>}
            </Box>
          </Flex>
        )}
      </Box>
    </div>
  );
};
