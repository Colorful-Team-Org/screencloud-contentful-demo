import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { AppConfig } from '../../../app-types';
import { useScreenCloudEditor } from '../ScreenCloudEditorProvider';
import EditorForm from './EditorForm';
import PreviewFrame from './PreviewFrame';

const EditorContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRight: `solid 1px ${theme.palette.grey[300]}`,
  [theme.breakpoints.up('md')]: {
    height: `100%`,
  },
}));

const PreviewContainer = styled(Grid)(({ theme }) => ({
  overflow: 'hidden',
  background: theme.palette.background.default,
  paddingTop: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    height: `100%`,
  },
}));

export default function Editor() {
  const sc = useScreenCloudEditor();
  const [config, setConfig] = useState<AppConfig | undefined>(sc.config);

  const onFormChange = useCallback(
    (newConfig: AppConfig | undefined) => {
      setConfig(newConfig);

      if (!newConfig) return;

      sc.onRequestConfigUpdate?.(() =>
        Promise.resolve({
          config: newConfig,
        })
      );
      sc.emitConfigUpdateAvailable?.();
    },
    [sc]
  );

  return (
    <Grid container sx={{ height: `100%` }}>
      <EditorContainer item sm={12} md={6} lg={4}>
        <EditorForm initialConfig={config} onChange={onFormChange} />
      </EditorContainer>
      <PreviewContainer item sm={12} md={6} lg={8}>
        <PreviewFrame config={config} />
      </PreviewContainer>
    </Grid>
  );
}
