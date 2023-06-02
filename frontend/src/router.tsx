import * as React from 'react';
import { useRoutes } from 'react-router-dom';

import { RecentListsContextProvider } from './contexts/RecentListsContext';
import { SocketContextProvider } from './contexts/SocketContext';
import { TodoItemContextProvider } from './contexts/TodoItemsContext';
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
        <RecentListsContextProvider>
          <EmptyState/>
        </RecentListsContextProvider>
      </TodoListsContextProvider>
    ),
  },
  {
    path: '/list/:id',
    element: (
      <TodoListsContextProvider>
        <RecentListsContextProvider>
          <TodoListContextProvider>
            <TodoItemContextProvider>
              <SocketContextProvider>
                <ListView/>
              </SocketContextProvider>
            </TodoItemContextProvider>
          </TodoListContextProvider>
        </RecentListsContextProvider>
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
