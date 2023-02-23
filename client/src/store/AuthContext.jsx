import { createContext, useState } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false);
  let value = {
    loginStatus,
    setLoginStatus,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
