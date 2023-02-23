import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authContext } from "../../store/AuthContext";

function PublicLayout() {
  const { loginStatus } = useContext(authContext);

  if (loginStatus) return <Navigate to="/admin/explore" />;

  return (
    <>
      <Outlet />
    </>
  );
}

export default PublicLayout;
