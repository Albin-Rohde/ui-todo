import React, { createContext, useState } from 'react';

import { User } from '../types';

const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}>({
  user: null,
  setUser: () => null,
});

interface UserContextProps {
  children: React.ReactNode;
}

const UserContextProvider: React.FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
