import { Box, Text } from "@screencloud/alfie-alpha";
import React, { CSSProperties, FunctionComponent } from "react";
import { ImageAsset } from "../../../service/schema-connector/content-mapping-service";
import styles from './QuoteAuthor.module.css';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  author: string;
  authorImage?: ImageAsset;
  className?: string;
  style?: CSSProperties
}
export const QuoteAuthor: FunctionComponent<Props> = (props) => {
  const { author, authorImage, ...divProps } = props;
  return (
    <div {...divProps}>
      <Box id="test" display="flex" flexDirection="column">
        {!!authorImage && (
          <img
            className={styles.authorImage}
            src={authorImage.url}
            alt={authorImage.description}
          />
        )}
        {!!author && (
          <Box mt={4} alignSelf="center">
            <Text textAlign="center" fontWeight="bold">{author}</Text>
          </Box>
            
        )}
      </Box>
    </div>
  )
}