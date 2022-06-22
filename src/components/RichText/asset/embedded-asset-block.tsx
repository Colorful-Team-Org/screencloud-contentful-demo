import React, { FunctionComponent } from 'react';
import { useGqlQuery } from '../../../service/contentful-api/contentful-graphql-service';
import { AssetType } from './fragments';
import ImageAsset from './image-asset';

interface Props {
  id: string;
  preview?: boolean;
}

const EmbeddedAssetBlock: FunctionComponent<Props> = (props: Props) => {
  // console.log(`EmbeddedAssetBlock`, props);
  const { id, preview } = props;
  const queryResponse = useGqlQuery<{ asset: AssetType }>(
    `query Asset($preview: Boolean) {
    asset(id: "${id}", preview: $preview) {
      __typename contentType sys { id }
      url
      title description
      width height
    }
  }`,
    { input: { preview } }
  );

  return (
    <div>{!!queryResponse.data && <ImageAsset {...queryResponse.data.asset} disableCaption />}</div>
  );
};

export default EmbeddedAssetBlock;
