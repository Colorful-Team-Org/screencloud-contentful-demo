import TextField from '@mui/material/TextField';
type Props = {
  label?: string;
  defaultValue?: number;
  disabled?: boolean;
  min?: number;
  max?: number;
  onBlur?: (value: number) => any;
};
export default function NumberField(props: Props) {
  const { min, max, onBlur, ...rest } = props;
  return (
    <TextField
      {...rest}
      type="number"
      inputProps={{
        min: String(props.min),
        max: String(props.max),
        onKeyPress: ev => {
          if (ev.code === 'Enter') {
            ev.currentTarget.blur();
          }
        },
        onBlur: ev => {
          let clamped = parseInt(ev.target.value);
          if (props.max) clamped = Math.min(props.max, clamped);
          if (props.min) clamped = Math.max(props.min, clamped);
          ev.target.value = '' + clamped;
          props.onBlur?.(clamped);
        },
      }}
      fullWidth
    />
  );
}
