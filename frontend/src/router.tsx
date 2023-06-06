import * as React from 'react';
import { useRoutes } from 'react-router-dom';

import { SocketContextProvider } from './contexts/SocketContext';
import { TodoItemContextProvider } from './contexts/TodoItemsContext';
import { TodoListContextProvider } from './contexts/TodoListContext'
import { Dashboard } from './pages/Dashboard/Dashboard';
import EmptyState from './pages/Dashboard/EmptyState';
import ListViewState from './pages/Dashboard/ListViewState';
import SignIn from './pages/SignIn/SignIn';
import Signup from './pages/Signup/Signup';

export const routes = [
  {
    path: '/',
    element: (
      <TodoListContextProvider>
        <Dashboard>
          <EmptyState/>
        </Dashboard>
      </TodoListContextProvider>
    ),
  },
  {
    path: '/list/:id',
    element: (
      <TodoListContextProvider>
        <TodoItemContextProvider>
          <SocketContextProvider>
            <Dashboard>
              <ListViewState/>
            </Dashboard>
          </SocketContextProvider>
        </TodoItemContextProvider>
      </TodoListContextProvider>
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
