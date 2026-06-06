import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);

  const setLoginData = (data, token) => {
    setUserData(data);
    setUserToken(token);
  };

  const logout = () => {
    setUserData(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        userToken,
        setLoginData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
