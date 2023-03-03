import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authContext } from "../../context/AuthContext";

function PublicLayout() {
  const { loginStatus } = useContext(authContext);

  if (loginStatus) return <Navigate to="/home" />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default PublicLayout;
