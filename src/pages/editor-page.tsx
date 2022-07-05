import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppConfig } from '../app-types';
import EditorForm from '../features/sc-editor/components/EditorForm';
import PreviewFrame from '../features/sc-editor/components/PreviewFrame';
import { scMuiTheme } from '../features/sc-editor/screencloud-mui-theme';
import { ScreenCloudEditorProvider } from '../features/sc-editor/ScreenCloudEditorProvider';

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
              <Container sx={{ flexBasis: '50%' }}>
                <EditorForm onChange={setConfig} />
              </Container>
              <Box sx={{ flexBasis: '50%', overflow: 'hidden' }}>
                <PreviewFrame config={config} />
              </Box>
            </Box>
          </QueryClientProvider>
        </ScreenCloudEditorProvider>
      </ThemeProvider>
    </>
  );
}
