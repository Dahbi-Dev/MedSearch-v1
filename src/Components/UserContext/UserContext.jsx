<<<<<<< HEAD
/* eslint-disable react-refresh/only-export-components */
=======
>>>>>>> de1435c9bb3b0638613931c759bf2e4b57e42752
// UserContext.js
import React,  { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
