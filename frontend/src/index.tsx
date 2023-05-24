import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {RouterProvider,} from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {ThemeProvider} from '@mui/material/styles';
import theme from './theme';
import {router} from "./router";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
