import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppConfig } from '../app-types';
import EditorForm from '../features/editor/components/EditorForm';
import PreviewFrame from '../features/editor/components/PreviewFrame';
import { scMuiTheme } from '../features/editor/screencloud-mui-theme';
import { ScreenCloudEditorProvider } from '../providers/ScreenCloudEditorProvider';

const queryClient = new QueryClient();

export default function EditorPage() {
  const [config, setConfig] = useState<AppConfig>();
  // console.log('EditorPage', config);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={scMuiTheme}>
        <ScreenCloudEditorProvider>
          <QueryClientProvider client={queryClient}>
            <Box display="flex" height={'100%'}>
              <Container sx={{ flexBasis: 300, overflow: 'hidden' }}>
                <EditorForm onChange={setConfig} />
              </Container>
              <PreviewFrame config={config} />
            </Box>
          </QueryClientProvider>
        </ScreenCloudEditorProvider>
      </ThemeProvider>
    </>
  );
}
