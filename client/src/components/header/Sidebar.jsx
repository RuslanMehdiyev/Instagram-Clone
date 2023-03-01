import { Avatar, Box, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Link, NavLink } from "react-router-dom";
import headerStyle from "./sidebar.module.css";
import { useContext } from "react";
import { authContext } from "../../store/AuthContext";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
        to={"/create"}
      >
        <AddBoxOutlinedIcon />
        <Typography className={headerStyle.sidebarLink}>Create</Typography>
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
        <Typography className={headerStyle.sidebarLink}>
          {user?.userName}
        </Typography>
      </NavLink>
    </Box>
  );
};

export default Sidebar;
