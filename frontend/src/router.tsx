import * as React from 'react';
import { useRoutes } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import SignIn from './pages/SignIn/SignIn';
import Signup from './pages/Signup/Signup';

export const routes = [
  {
    path: '/',
    element: <Dashboard/>,
  },
  {
    path: '/signin',
    element: <SignIn/>,
  },
  {
    path: '/signup',
    element: <Signup/>,
  }
];

export const Router = (): React.ReactElement | null => {
  return useRoutes(routes);
}
