import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

const SpinnerBoxRoot = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: `rgba(255, 255, 255, .75)`,
});

export default function SpinnerBox() {
  return (
    <SpinnerBoxRoot>
      <CircularProgress />
    </SpinnerBoxRoot>
  );
}
