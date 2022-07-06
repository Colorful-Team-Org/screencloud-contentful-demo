import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { AppConfig } from '../../../app-types';
import EditorForm from './EditorForm';
import PreviewFrame from './PreviewFrame';

const EditorContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRight: `solid 1px ${theme.palette.grey[300]}`,
  [theme.breakpoints.up('md')]: {
    height: `100%`,
  }
}));

const PreviewContainer = styled(Grid)(({ theme }) => ({
  overflow: 'hidden',
  background: theme.palette.background.default,
  paddingTop: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    height: `100%`,
  }
}));

export default function ScEditor() {
  const [config, setConfig] = useState<AppConfig>();
  console.log('background', useTheme().palette.background);
  return (
    <Grid container sx={{ height: `100%`}}>
      <EditorContainer sm={12} md={6} lg={4}>
        <EditorForm onChange={setConfig} />
      </EditorContainer>
      <PreviewContainer sm={12} md={6} lg={8}>
        <PreviewFrame config={config} />
      </PreviewContainer>
    </Grid>
  );
}
