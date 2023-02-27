import { Avatar, Box, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Link, NavLink } from "react-router-dom";
import headerStyle from "./sidebar.module.css";

const Sidebar = () => {
  return (
    <Box className={headerStyle.sidebar}>
      <Link className={headerStyle.logo} to={"/home"}>
        Instagram
      </Link>
      <NavLink
        className={({ isActive }) =>
          isActive ? headerStyle.active : headerStyle.link
        }
        to={"/home"}
      >
        <HomeOutlinedIcon />
        <Typography className={headerStyle.sidebarLink}>Home</Typography>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? headerStyle.active : headerStyle.link
        }
        to={"/explore"}
      >
        <ExploreOutlinedIcon />
        <Typography className={headerStyle.sidebarLink}>Explore</Typography>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? headerStyle.active : headerStyle.link
        }
        to={"/direct"}
      >
        <ChatOutlinedIcon />
        <Typography className={headerStyle.sidebarLink}>Messages</Typography>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? headerStyle.active : headerStyle.link
        }
        to={"/account"}
      >
        <Avatar src="" alt="Ruslan" />
        <Typography className={headerStyle.sidebarLink}>Account</Typography>
      </NavLink>
    </Box>
  );
};

export default Sidebar;
