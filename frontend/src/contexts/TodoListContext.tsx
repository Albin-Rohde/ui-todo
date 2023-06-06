import React, { createContext, useState } from 'react';

import { TodoList } from '../types';

const TodoListContext = createContext<{
  currentTodoList: TodoList | null;
  setCurrentTodolist: React.Dispatch<React.SetStateAction<TodoList | null>>
  recentLists: TodoList[];
  setRecentlists: React.Dispatch<React.SetStateAction<TodoList[]>>
  todoLists: TodoList[];
  setTodolists: React.Dispatch<React.SetStateAction<TodoList[]>>
}>({
  currentTodoList: null,
  setCurrentTodolist: () => null,
  recentLists: [],
  setRecentlists: () => [],
  todoLists: [],
  setTodolists: () => [],
});

interface UserContextProps {
  children: React.ReactNode;
}

const TodoListContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [currentTodoList, setCurrentTodolist] = useState<TodoList | null>(null);
  const [recentLists, setRecentlists] = useState<TodoList[]>([]);
  const [todoLists, setTodolists] = useState<TodoList[]>([]);

  return (
    <TodoListContext.Provider
      value={{
        currentTodoList,
        setCurrentTodolist,
        recentLists,
        setRecentlists,
        todoLists,
        setTodolists,
      }}>
      {children}
    </TodoListContext.Provider>
  );
};

export { TodoListContext, TodoListContextProvider };
