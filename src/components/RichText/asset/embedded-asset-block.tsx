import React, { FunctionComponent } from "react";
import { useGqlQuery } from "../../../service/contentful-api/contentful-graphql-service";
import { AssetType } from "./fragments";
import ImageAsset from "./image-asset";

interface Props {
  id: string;
}

const EmbeddedAssetBlock: FunctionComponent<Props> = (props: Props) => {
  // console.log(`EmbeddedAssetBlock`, props);
  const queryResponse = useGqlQuery<{ asset: AssetType}>(`query Assset {
    asset(id: "${props.id}") {
      __typename contentType sys { id }
      url
      title description
      width height
    }
  }`);

  return (
    <div>
      {!!queryResponse.data && (
        <ImageAsset {...queryResponse.data.asset} disableCaption />
      )}
    </div>
  )
}

export default EmbeddedAssetBlock;