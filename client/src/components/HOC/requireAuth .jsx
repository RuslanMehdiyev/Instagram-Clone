import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const requireAuth = (Component) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("user");

    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/");
      }
    }, [isAuthenticated]);

    return <Component {...props} />;
  };

  return AuthComponent;
};

export default requireAuth;
