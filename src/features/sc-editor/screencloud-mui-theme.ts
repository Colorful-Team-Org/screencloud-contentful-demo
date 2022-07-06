import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    background: {
      default: '#f8f8f8',
      paper: '#fff',
    },
    primary: {
      main: '#F7D146',
    },
    secondary: {
      main: '#325FE4',
    },
  },
});

const textFieldComponent: ThemeOptions = {
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: `solid 1px ${baseTheme.palette.text.primary}`,
          },
        },
        input: {
          padding: 12,
        },
      },
    },
  },
};

const switchComponent: ThemeOptions = {
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 0,
          margin: 2,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor:
                baseTheme.palette.mode === 'dark' ? '#2ECA45' : baseTheme.palette.primary.main,
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: baseTheme.palette.mode === 'light' ? 0.5 : 0.3,
            },
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.75,
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              baseTheme.palette.mode === 'light'
                ? baseTheme.palette.grey[100]
                : baseTheme.palette.grey[600],
          },
        },
        thumb: {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        track: {
          borderRadius: 26 / 2,
          backgroundColor:
            baseTheme.palette.mode === 'light' ? baseTheme.palette.grey[300] : '#39393D',
          opacity: 1,
        },
      },
    },
  },
};

export const scMuiTheme = createTheme(baseTheme, textFieldComponent, switchComponent);
