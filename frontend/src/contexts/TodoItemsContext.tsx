import React, { createContext, useState } from 'react';

import { CursorPosition, TodoItem } from '../types';

const TodoItemContext = createContext<{
  todoItems: TodoItem[];
  cursorPositions: CursorPosition[];
  setTodoItems: React.Dispatch<React.SetStateAction<TodoItem[]>>
  setCursorPositions: React.Dispatch<React.SetStateAction<CursorPosition[]>>
}>({
  todoItems: [],
  cursorPositions: [],
  setTodoItems: () => null,
  setCursorPositions: () => null,
});

interface UserContextProps {
  children: React.ReactNode;
}

const TodoItemContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [cursorPositions, setCursorPositions] = useState<CursorPosition[]>([]);

  return (
    <TodoItemContext.Provider
      value={{ todoItems, setTodoItems, cursorPositions, setCursorPositions }}>
      {children}
    </TodoItemContext.Provider>
  );
};

export { TodoItemContext, TodoItemContextProvider };
