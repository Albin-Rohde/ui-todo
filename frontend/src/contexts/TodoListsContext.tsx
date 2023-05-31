import React, { createContext, useState } from 'react';

import { TodoList } from '../types';

const TodoListsContext = createContext<{
  todoLists: TodoList[] | [];
  setTodolists: React.Dispatch<React.SetStateAction<TodoList[] | []>>
}>({
  todoLists: [],
  setTodolists: () => [],
});

interface UserContextProps {
  children: React.ReactNode;
}

const TodoListsContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [todoLists, setTodolists] = useState<TodoList[]>([]);

  return (
    <TodoListsContext.Provider value={{ todoLists, setTodolists }}>
      {children}
    </TodoListsContext.Provider>
  );
};

export { TodoListsContext, TodoListsContextProvider };
