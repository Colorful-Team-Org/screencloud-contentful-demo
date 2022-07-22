import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { PropsWithChildren } from 'react';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

const LabeledGridItemRoot = styled(Grid)(({ theme }) => ({
  // marginBottom: theme.spacing(2),
  '& label': {
    lineHeight: `2.5em`,
  },
}));
type Props = {
  id: string;
  label: string;
  tooltip?: string;
  required?: boolean;
};

export function LabeledGridItem(props: PropsWithChildren<Props>) {
  return (
    <LabeledGridItemRoot item xs={12}>
      <Box display="flex" alignItems="center">
        <FormLabel htmlFor={props.id} required={props.required}>
          {props.label}
        </FormLabel>
        {props.tooltip && (
          <Tooltip placement="top" arrow title={props.tooltip}>
            <InfoIcon sx={{ ml: '4px' }} color="disabled" fontSize="small" />
          </Tooltip>
        )}
      </Box>
      {props.children}
    </LabeledGridItemRoot>
  );
}
