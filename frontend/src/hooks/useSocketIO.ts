import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

import { SocketContext } from '../contexts/SocketContext';
import { TodoItemContext } from '../contexts/TodoItemsContext';
import { TodoListContext } from '../contexts/TodoListContext';
import { TodoItem, TodoList } from '../types';

const useSocketIO = () => {
  const { socket, setSocket, isConnected, setIsConnected } = useContext(SocketContext);
  const { todoList, setTodolist } = useContext(TodoListContext)
  const { todoItems, setTodoItems } = useContext(TodoItemContext);

  useEffect(() => {
    if (socket) {
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
    } else {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket'],
        autoConnect: false,
      });
      setSocket(newSocket);
    }
    return () => {
      if (socket && isConnected) {
        socket.disconnect();
        setIsConnected(false);
      }
    }
  }, []);

  useEffect(() => {
    if (socket && !isConnected) {
      socket.connect();

      socket.on('todolist.list-updated', (data: TodoList) => {
        if (todoList && data.id === todoList.id) {
          setTodolist(data);
        }
      });

      socket.on('todoitem.item-updated', (data: TodoItem) => {
        setTodoItems((prev: TodoItem[]) => {
          return prev.map((item) => {
            if (item.id === data.id) {
              return data;
            }
            return item;
          });
        });
      });

      socket.on('todoitem.item-created', (data: TodoItem) => {
        if (todoItems) {
          const newItems = [...todoItems, data];
          setTodoItems(newItems);
        }
      });

      socket.on('connect', () => {
        setIsConnected(true);
      })
    }
  }, [socket]);

  return { socket, isConnected };
};


export default useSocketIO;
