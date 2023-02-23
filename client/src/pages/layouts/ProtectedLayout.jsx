import { Outlet } from "react-router-dom";

function ProtectedLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default ProtectedLayout;
