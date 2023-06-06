import React, { createContext, useState } from 'react';

import { TodoList } from '../types';

const TodoListContext = createContext<{
  currentTodoList: TodoList | null;
  setCurrentTodolist: React.Dispatch<React.SetStateAction<TodoList | null>>
}>({
  currentTodoList: null,
  setCurrentTodolist: () => null,
});

interface UserContextProps {
  children: React.ReactNode;
}

const TodoListContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [todoList, setTodolist] = useState<TodoList | null>(null);

  return (
    <TodoListContext.Provider
      value={{ currentTodoList: todoList, setCurrentTodolist: setTodolist }}>
      {children}
    </TodoListContext.Provider>
  );
};

export { TodoListContext, TodoListContextProvider };
