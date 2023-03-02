import { createContext, useState } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  let value = {
    loginStatus,
    setLoginStatus,
    currentUser,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
