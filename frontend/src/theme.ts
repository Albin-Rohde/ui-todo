import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007afe',
    },
    secondary: {
      main: '#0f8aef',
    },
    text: {
      primary: '#252525',
    },
    background: {
      default: '#f8f8f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
