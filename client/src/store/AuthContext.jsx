import { createContext, useState } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [adminUser, setAdminUser] = useState({});
  let value = {
    loginStatus,
    setLoginStatus,
    adminUser,
    setAdminUser,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
