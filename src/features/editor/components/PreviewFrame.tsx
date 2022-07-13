import { styled, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { urlParamsFrom } from '../../sc-player/url-params';
import { ReactComponent as EmptySvg } from '../assets/empty-app-config.svg';

type Props = {
  config?: {
    spaceId: string;
    apiKey: string;
    contentFeed: string;
    appDefinitionName?: string;
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
  boxShadow: `rgba(0, 0, 0, 0.4) 0px 90px 40px -80px`,
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
  }, [config]); // need `config` as a dependency because `rootRef.current` depends on it.

  const src = useMemo(() => (config ? `/?${urlParamsFrom(config)}` : undefined), [config]);

  return (
    <PreviewFrameRoot>
      <IFrameContainer ref={rootref}>
        {!!config?.spaceId && !!config.apiKey && !!config.contentFeed ? (
          // {false ? (
          <IFrame
            style={{
              transform: `scale(${iFrameScale})`,
            }}
            title="Preview"
            src={src}
          />
        ) : (
          <Empty>
            <EmptySvg style={{ width: `25%`, marginBottom: 40 }} />
            <Typography fontWeight="bold">App instance preview</Typography>
            <Typography>Edit the configuration to preview this app instnace.</Typography>
          </Empty>
        )}
      </IFrameContainer>
    </PreviewFrameRoot>
  );
}
