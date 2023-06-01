import React, { createContext, useState } from 'react';

import { TodoItem } from '../types';

const TodoItemContext = createContext<{
  todoItems: TodoItem[];
  setTodoItems: React.Dispatch<React.SetStateAction<TodoItem[]>>
}>({
  todoItems: [],
  setTodoItems: () => null,
});

interface UserContextProps {
  children: React.ReactNode;
}

const TodoItemContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

  return (
    <TodoItemContext.Provider value={{ todoItems, setTodoItems }}>
      {children}
    </TodoItemContext.Provider>
  );
};

export { TodoItemContext, TodoItemContextProvider };
