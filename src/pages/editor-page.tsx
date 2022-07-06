import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppConfig } from '../app-types';
import ScEditor from '../features/sc-editor/components/ScEditor';
import { scMuiTheme } from '../features/sc-editor/screencloud-mui-theme';
import { ScreenCloudEditorProvider } from '../features/sc-editor/ScreenCloudEditorProvider';
import { Helmet } from 'react-helmet';

const queryClient = new QueryClient();

export default function EditorPage() {
  const [config, setConfig] = useState<AppConfig>();
  // console.log('EditorPage', config);

  console.log('scMuiTheme', scMuiTheme.palette.background);
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <CssBaseline />
      <ThemeProvider theme={scMuiTheme}>
        <ScreenCloudEditorProvider>
          <QueryClientProvider client={queryClient}>
            <ScEditor />
          </QueryClientProvider>
        </ScreenCloudEditorProvider>
      </ThemeProvider>
    </>
  );
}
