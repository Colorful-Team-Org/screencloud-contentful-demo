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
    {!!authorImage && (
      <img
        className={styles.authorImage}
        src={authorImage.url}
        alt={authorImage.description}
      />
    )}
    </div>
  )
}