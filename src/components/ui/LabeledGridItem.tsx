import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { PropsWithChildren } from 'react';

const LabeledGridItemRoot = styled(Grid)(({ theme }) => ({
  // marginBottom: theme.spacing(2),
  '& > label': {
    lineHeight: `2.5em`,
  }
}));
type Props = {
  id: string;
  label: string;
  required?: boolean;
};

export function LabeledGridItem(props: PropsWithChildren<Props>) {
  return (
    <LabeledGridItemRoot item xs={12}>
      <FormLabel htmlFor={props.id} required={props.required}>
        {props.label}
      </FormLabel>
      {props.children}
    </LabeledGridItemRoot>
  );
}
