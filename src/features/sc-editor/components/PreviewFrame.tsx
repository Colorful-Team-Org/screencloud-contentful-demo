import { styled, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { urlParamsFrom } from '../../sc-player/url-params';

type Props = {
  config?: {
    spaceId: string;
    apiKey: string;
    contentFeed: string;
  };
};

const previewSize = [1920, 1080];
const previewPadding = 40;

const PreviewFrameRoot = styled('div')({
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
});

const IFrameContainer = styled('div')({
  width: `calc(100% - ${previewPadding * 2}px)`,
  aspectRatio: `${previewSize[0]} / ${previewSize[1]}`,
  margin: previewPadding,
  overflow: 'hidden',
  border: `solid 6px black`,
  borderRadius: 3,
  boxShadow: `rgba(0, 0, 0, 0.4) 0px 90px 80px -80px`,
});

const IFrame = styled('iframe')({
  width: previewSize[0],
  height: previewSize[1],
  border: 'none',
  padding: 0,
  margin: 0,
  transformOrigin: '0 0',
});

const Empty = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export default function PreviewFrame(props: Props) {
  // console.log('PreviewFrame', props);
  const [iFrameScale, setIFrameScale] = useState(1);

  const { config } = props;
  const rootref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const onResize = debounce(() => {
      const rect = rootref.current?.getBoundingClientRect();
      if (!rect) return;
      setIFrameScale(rect.width / (previewSize[0] + (previewPadding >> 1)));
    }, 250);

    onResize();
    onResize.flush();

    window.addEventListener('resize', onResize);
    return () => {
      onResize.cancel();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const src = useMemo(() => (config ? `/?${urlParamsFrom(config)}` : undefined), [config]);

  return (
    <PreviewFrameRoot>
      {!!config?.spaceId && !!config.apiKey && !!config.contentFeed ? (
        <IFrameContainer ref={rootref}>
          <IFrame
            style={{
              transform: `scale(${iFrameScale})`,
            }}
            title="Preview"
            src={src}
          />
        </IFrameContainer>
      ) : (
        <Empty>
          <Typography variant="h5" color="grey.500">
            Preview area
          </Typography>
          <Typography variant="h6" color="grey.500" mt={2}>
            Please complete your configuration.
          </Typography>
        </Empty>
      )}
    </PreviewFrameRoot>
  );
}
