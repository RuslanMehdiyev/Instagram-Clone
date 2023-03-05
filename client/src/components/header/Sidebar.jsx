import { Avatar, Box, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Link, NavLink } from "react-router-dom";
import headerStyle from "./sidebar.module.css";
import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import logo from "../../assets/images/instaicon.png";

const Sidebar = () => {
  const { currentUser } = useContext(authContext);

  return (
    <Box className={headerStyle.sidebar}>
      <Link className={headerStyle.link} to={"/home"}>
        <img src={logo} alt="Inst" />
        <Typography className={headerStyle.sidebarLink}>Instagram</Typography>
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
        <Typography className={headerStyle.sidebarLink}>Direct</Typography>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? headerStyle.active : headerStyle.link
        }
        to={"/profile/" + currentUser?._id}
      >
        <Avatar
          src={currentUser?.avatar ? currentUser.avatar : ""}
          sx={{ width: 45, height: 45 }}
          alt="Ruslan"
        />
        <Typography className={headerStyle.sidebarLink}>
          {currentUser?.userName}
        </Typography>
      </NavLink>
    </Box>
  );
};

export default Sidebar;
