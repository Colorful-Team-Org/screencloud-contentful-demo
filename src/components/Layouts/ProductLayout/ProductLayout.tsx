import {
  FullScreenImage, SplitLayoutContainer, theme
} from "@screencloud/alfie-alpha";
import React, { FunctionComponent, ReactElement } from "react";
import { ContentfulProductItem } from "../../../providers/ContentfulDataProvider";
import { ProductRightContent } from "./ProductRightContent";

interface Props {
  itemDurationSeconds: number;
  companyLogoUrl?: string;
  item: ContentfulProductItem;
  progressBarColor?: string;
  themedColor?: string;
  isPortrait: boolean;
}

export const ProductLayout: FunctionComponent<Props> = (
  props: Props
): ReactElement<Props> => {
  const {
    itemDurationSeconds,
    item,
    companyLogoUrl,
    progressBarColor,
    isPortrait,
    themedColor,
  } = props;

  const themeColor = themedColor || theme.colors.gray;

  return (
    <SplitLayoutContainer
      leftContentWidth={"50"}
      rightContentWidth={"50"}
      isPortrait={isPortrait}
      borderColor={themeColor}
      leftContent={
        <FullScreenImage
          url={item.image?.url ? `${item.image?.url}?w=2048` : ""}
          itemDurationSeconds={itemDurationSeconds}
        />
      }
      rightContent={
        <ProductRightContent
          itemDurationSeconds={itemDurationSeconds}
          item={item}
          progressBarColor={progressBarColor}
          companyLogoUrl={companyLogoUrl}
        />
      }
    />
  );
};
