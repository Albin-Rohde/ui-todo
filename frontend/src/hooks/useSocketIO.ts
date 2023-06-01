import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { SocketContext } from '../contexts/SocketContext';
import { TodoListContext } from '../contexts/TodoListContext';

const useSocketIO = () => {
  const { socket, setSocket, isConnected, setIsConnected } = useContext(SocketContext);
  const { todoList, setTodolist } = useContext(TodoListContext)
  const [prevId, setPrevId] = useState<string | null>(null);

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
      }
    }
  }, []);

  useEffect(() => {
    if (todoList && socket && isConnected) {
      if (prevId !== null && prevId !== todoList.publicId) {
        socket.emit('todolist.leave-room', { id: prevId });
      }
      socket.emit('todolist.join-room', { id: todoList.publicId });
      setPrevId(todoList.publicId);
    }
  }, [todoList]);
};

export default useSocketIO;
