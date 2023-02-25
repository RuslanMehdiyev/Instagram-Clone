import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/header/Sidebar";

function ProtectedLayout() {
  return (
    <>
      <Box width={"100%"} display="flex">
        <Sidebar />
        <Outlet />
      </Box>
    </>
  );
}

export default ProtectedLayout;
