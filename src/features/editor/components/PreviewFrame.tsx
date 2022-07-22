import { styled, Typography } from '@mui/material';
import Box from '@mui/system/Box';
import { debounce } from 'lodash';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AppConfig } from '../../../app-types';
import { urlParamsFrom } from '../../sc-player/url-params';
import { ReactComponent as EmptySvg } from '../assets/empty-app-config.svg';

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

const EmptyRoot = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

type Props = {
  config?: AppConfig;
  error?: {
    title?: string;
    message: string;
  };
};

export default function PreviewFrame(props: Props) {
  // console.log('PreviewFrame', props);
  const [iFrameScale, setIFrameScale] = useState(1);

  const { config, error } = props;
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

  const src = useMemo(() => {
    if (!config?.spaceId || config.apiKey || config.contentFeed) return undefined;
    const previewConfig = {
      ...config,
      fetchInterval: 5000,
    };
    return `/?${urlParamsFrom(previewConfig)}`;
  }, [config]);

  return (
    <PreviewFrameRoot>
      <IFrameContainer ref={rootref}>
        {error ? (
          <Empty {...error} />
        ) : src ? (
          // {false ? (
          <IFrame
            style={{
              transform: `scale(${iFrameScale})`,
            }}
            title="Preview"
            src={src}
          />
        ) : (
          <Empty
            title="App instance preview"
            message="Edit the configuration to preview this app instance."
            showIcon
          />
        )}
      </IFrameContainer>
    </PreviewFrameRoot>
  );
}

function Empty(props: { message: string; title?: string; showIcon?: boolean }) {
  return (
    <EmptyRoot>
      {!!props.showIcon && <EmptySvg style={{ width: `25%`, height: 'auto', marginBottom: 40 }} />}
      <Box mx={2}>
        {props.title && (
          <Typography textAlign="center" fontWeight="bold">
            {props.title}
          </Typography>
        )}
        {props.message && <Typography textAlign="center">{props.message}</Typography>}
      </Box>
    </EmptyRoot>
  );
}
