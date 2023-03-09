import { createContext, useState } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  let value = {
    loginStatus,
    setLoginStatus,
    currentUser,
    setCurrentUser,
    fetch,
    setFetch,
    selectedConversation,
    setSelectedConversation,
    currentChat,
    setCurrentChat,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
