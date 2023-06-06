import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

import { SocketContext } from '../contexts/SocketContext';
import { TodoItemContext } from '../contexts/TodoItemsContext';
import { TodoListContext } from '../contexts/TodoListContext';
import { CursorPosition, TodoItem, TodoList } from '../types';
import { getSubItems } from '../utils';


const useSocketIO = () => {
  const { socket, setSocket, isConnected, setIsConnected } = useContext(SocketContext);
  const { todoList, setTodolist } = useContext(TodoListContext)
  const { setTodoItems, setCursorPositions } = useContext(TodoItemContext);
  const baseUrl = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    if (socket) {
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
    } else {
      const newSocket = io(baseUrl, {
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
          const subItems = getSubItems(data, prev)

          return prev.map((item) => {
            if (item.id === data.id) {
              return data;
            }
            if (subItems.includes(item)) {
              return {
                ...item,
                completed: data.completed,
              }
            }
            return item;
          });
        });
      });

      socket.on('todoitem.item-created', (data: TodoItem) => {
        setTodoItems((prev: TodoItem[]) => {
          return [...prev, data];
        });
      });

      socket.on('todoitem.item-deleted', (data: TodoItem) => {
        setTodoItems((prev: TodoItem[]) => {
          const subItems = getSubItems(data, prev);
          return prev.filter((item) => {
            if (item.id === data.id) {
              return false;
            }
            return !subItems.includes(item);
          });
        });
      });

      socket?.on('todoitem.cursor-pos-updated', (data: CursorPosition) => {
        setCursorPositions((prev) => {
          // remove old cursor position
          const filtered = prev.filter((cursorPoss) => {
            return cursorPoss.userId !== data.userId;
          });
          // add new cursor position
          return [
            ...filtered,
            data,
          ];
        });
      });

      socket.on('connect', () => {
        setIsConnected(true);
      })
    }
  }, [socket]);

  return { socket, isConnected };
};


export default useSocketIO;
