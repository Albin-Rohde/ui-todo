import React, { createContext, useState } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<{
  socket: Socket | null;
  isConnected: boolean;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
}>({
  socket: null,
  isConnected: false,
  setSocket: () => null,
  setIsConnected: () => false,
});

interface SocketContextProps {
  children: React.ReactNode;
}

const SocketContextProvider: React.FC<SocketContextProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <SocketContext.Provider value={{ socket, setSocket, isConnected, setIsConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };
