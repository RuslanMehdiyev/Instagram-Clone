import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/header/Sidebar";
import requireAuth from "../../components/HOC/requireAuth ";

function ProtectedLayout() {
  return (
    <>
      <Box
        width={"100%"}
        sx={{
          display: "block",
          "@media screen and (min-width: 770px)": {
            display: "flex",
          },
        }}
      >
        <Sidebar />
        <Outlet />
      </Box>
    </>
  );
}

export default requireAuth(ProtectedLayout);
