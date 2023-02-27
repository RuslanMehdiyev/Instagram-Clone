import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/header/Sidebar";

function ProtectedLayout() {
  return (
    <>
      <Box
        width={"100%"}
        sx={{
          display: "block", // default to block display for phone and tablet screens
          "@media screen and (min-width: 770px)": {
            display: "flex", // switch to flex display for larger screens
          },
        }}
      >
        <Sidebar />
        <Outlet />
      </Box>
    </>
  );
}

export default ProtectedLayout;
