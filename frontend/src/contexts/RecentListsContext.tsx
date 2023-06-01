import React, { createContext, useState } from 'react';

import { TodoList } from '../types';

const RecentListsContext = createContext<{
  recentLists: TodoList[] | [];
  setRecentlists: React.Dispatch<React.SetStateAction<TodoList[] | []>>
}>({
  recentLists: [],
  setRecentlists: () => [],
});

interface UserContextProps {
  children: React.ReactNode;
}

const RecentListsContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [recentLists, setRecentlists] = useState<TodoList[]>([]);

  return (
    <RecentListsContext.Provider value={{ recentLists, setRecentlists }}>
      {children}
    </RecentListsContext.Provider>
  );
};

export { RecentListsContext, RecentListsContextProvider };
