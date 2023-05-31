import * as React from 'react';
import { useRoutes } from 'react-router-dom';

import { TodoListContextProvider } from './contexts/TodoListContext'
import { TodoListsContextProvider } from './contexts/TodoListsContext'
import EmptyState from './pages/Dashboard/EmptyState';
import ListView from './pages/Dashboard/TodoListView';
import SignIn from './pages/SignIn/SignIn';
import Signup from './pages/Signup/Signup';

export const routes = [
  {
    path: '/',
    element: (
      <TodoListsContextProvider>
        <EmptyState/>
      </TodoListsContextProvider>
    ),
  },
  {
    path: '/list/:id',
    element: (
      <TodoListsContextProvider>
        <TodoListContextProvider>
          <ListView/>
        </TodoListContextProvider>
      </TodoListsContextProvider>
    ),
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
