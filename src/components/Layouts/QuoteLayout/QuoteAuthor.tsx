import { Box, Text } from '@screencloud/alfie-alpha';
import React, { CSSProperties, FunctionComponent } from 'react';
import { ImageAsset } from '../../../service/schema-connector/content-mapping-service';
import styles from './QuoteAuthor.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  author: string;
  authorImage?: ImageAsset;
  centered?: boolean;
  className?: string;
  style?: CSSProperties;
};
export const QuoteAuthor: FunctionComponent<Props> = props => {
  const { author, authorImage, centered, ...divProps } = props;
  return (
    <div {...divProps}>
      <Box id="test" display="flex" flexDirection="column">
        {!!authorImage && (
          <Box mb={4}>
            <img
              className={styles.authorImage}
              src={authorImage.url}
              alt={authorImage.description}
            />
          </Box>
        )}
        {!!author && (
          <Box alignSelf={!!centered ? 'center' : undefined}>
            <Text fontWeight="bold">{author}</Text>
          </Box>
        )}
      </Box>
    </div>
  );
};
