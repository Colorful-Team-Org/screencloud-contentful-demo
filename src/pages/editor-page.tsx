import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppConfig } from '../app-types';
import ScEditor from '../features/sc-editor/components/ScEditor';
import { scMuiTheme } from '../features/sc-editor/screencloud-mui-theme';
import { ScreenCloudEditorProvider } from '../features/sc-editor/ScreenCloudEditorProvider';

const queryClient = new QueryClient();

export default function EditorPage() {
  const [config, setConfig] = useState<AppConfig>();
  // console.log('EditorPage', config);

  console.log('scMuiTheme', scMuiTheme.palette.background);
  return (
    <>
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
