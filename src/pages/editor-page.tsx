import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from 'react-query';
import Editor from '../features/editor/components/Editor';
import { scMuiTheme } from '../features/editor/screencloud-mui-theme';
import { ScreenCloudEditorProvider } from '../features/editor/ScreenCloudEditorProvider';

const queryClient = new QueryClient();

export default function EditorPage() {
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
            <Editor />
          </QueryClientProvider>
        </ScreenCloudEditorProvider>
      </ThemeProvider>
    </>
  );
}
