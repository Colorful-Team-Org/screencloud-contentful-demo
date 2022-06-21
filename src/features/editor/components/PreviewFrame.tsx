import { styled, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { useLayoutEffect, useRef, useState } from 'react';

type Props = {
  config?: {
    spaceId: string;
    apiKey: string;
    contentFeed: string;
  };
};

const previewSize = [1920, 1080];
const previewPadding = 16;

const PreviewFrameRoot = styled('div')({
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
});

const IFrame = styled('iframe')({
  width: previewSize[0],
  height: previewSize[1],
  transformOrigin: '0 0',
  border: `solid 8px black`,
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
      setIFrameScale(rect.width / (previewSize[0] + previewPadding * 2));
    }, 1000);

    onResize();
    onResize.flush();

    window.addEventListener('resize', onResize);
    return () => {
      onResize.cancel();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <PreviewFrameRoot ref={rootref}>
      {!!config?.spaceId && !!config.apiKey && !!config.contentFeed ? (
        <IFrame
          style={{
            transform: `scale(${iFrameScale}) translate(${previewPadding}px, ${previewPadding}px)`,
          }}
          title="Preview"
          src={`/?space-id=${config.spaceId}&api-key=${config.apiKey}&contentfeed=${config.contentFeed}`}
        />
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
