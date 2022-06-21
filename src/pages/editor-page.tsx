import { Box, Container, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import EditorForm, { ContentFeedConfig } from '../features/editor/components/EditorForm';
import PreviewFrame from '../features/editor/components/PreviewFrame';
import { ScreenCloudEditorProvider } from '../providers/ScreenCloudEditorProvider';
import { ThemeProvider } from '@mui/material';
import { scMuiTheme } from '../features/editor/screencloud-mui-theme';

const queryClient = new QueryClient();

export default function EditorPage() {
  const [config, setConfig] = useState<ContentFeedConfig>();

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
              {/* <Box sx={{ flex: 1 }}>
            {!!config?.spaceId && !!config.apiKey && !!config.contentFeed && (
              <ContentfulApiContext.Provider
                value={{
                  apiKey: config.apiKey,
                  spaceId: config.spaceId,
                }}
              >
                <ContentfulDataProvider contentFeedId={config.contentFeed} refetchInterval={3000}>
                  <App key={config.contentFeed} />
                </ContentfulDataProvider>
              </ContentfulApiContext.Provider>
            )}
          </Box> */}
            </Box>
          </QueryClientProvider>
        </ScreenCloudEditorProvider>
      </ThemeProvider>
    </>
  );
}
