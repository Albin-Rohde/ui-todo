import { ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import { UserContextProvider } from './contexts/UserContext';
import reportWebVitals from './reportWebVitals';
import { Router } from './router';
import theme from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <BrowserRouter>
          <Router/>
        </BrowserRouter>
      </UserContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
