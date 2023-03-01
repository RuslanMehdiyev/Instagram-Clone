import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const requireAuth = (Component) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const isAuthenticated = localStorage.getItem("user");
      if (!isAuthenticated) {
        navigate("/");
      }
    }, [history]);

    return <Component {...props} />;
  };

  return AuthComponent;
};

export default requireAuth;
