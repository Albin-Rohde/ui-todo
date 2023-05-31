import React, { createContext, useState } from 'react';

import { TodoList } from '../types';

const TodoListContext = createContext<{
  todoList: TodoList | null;
  setTodolist: React.Dispatch<React.SetStateAction<TodoList | null>>
}>({
  todoList: null,
  setTodolist: () => null,
});

interface UserContextProps {
  children: React.ReactNode;
}

const TodoListContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [todoList, setTodolist] = useState<TodoList | null>(null);

  return (
    <TodoListContext.Provider value={{ todoList, setTodolist }}>
      {children}
    </TodoListContext.Provider>
  );
};

export { TodoListContext, TodoListContextProvider };
