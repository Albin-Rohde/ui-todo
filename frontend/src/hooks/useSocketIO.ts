import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

import { SocketContext } from '../contexts/SocketContext';

const useSocketIO = () => {
  const { socket, setSocket, isConnected, setIsConnected } = useContext(SocketContext);

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
};

export default useSocketIO;
