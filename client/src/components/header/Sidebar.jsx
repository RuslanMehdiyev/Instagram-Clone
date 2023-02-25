import { styled } from "@mui/system";
import { Avatar, Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MessageIcon from "@mui/icons-material/Message";

const Sidebar = () => {
  const SidebarWrapper = styled(Box)({
    width: "20%",
    height: "100vh",
    backgroundColor: "#F5F5F5",
    padding: "20px",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "column",
  });

  const SidebarHeading = styled(Typography)({
    fontWeight: 700,
    fontSize: "1.2rem",
    marginBottom: "20px",
  });

  const SidebarLinkWrapper = styled(Box)({
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    cursor: "pointer",
  });

  const SidebarIcon = styled(Box)({
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    backgroundColor: "#FFF",
    borderRadius: "50%",
  });

  const SidebarLink = styled(Typography)({
    fontWeight: 500,
    fontSize: "1rem",
  });

  return (
    <SidebarWrapper>
      <SidebarHeading>Instagram</SidebarHeading>
      <SidebarLinkWrapper>
        <SidebarIcon>
          <HomeIcon />
        </SidebarIcon>
        <SidebarLink>Home</SidebarLink>
      </SidebarLinkWrapper>
      <SidebarLinkWrapper>
        <SidebarIcon>
          <ExploreIcon />
        </SidebarIcon>
        <SidebarLink>Explore</SidebarLink>
      </SidebarLinkWrapper>
      <SidebarLinkWrapper>
        <SidebarIcon>
          <BookmarkIcon />
        </SidebarIcon>
        <SidebarLink>Saved</SidebarLink>
      </SidebarLinkWrapper>
      <SidebarLinkWrapper>
        <SidebarIcon>
          <MessageIcon />
        </SidebarIcon>
        <SidebarLink>Messages</SidebarLink>
      </SidebarLinkWrapper>
      <SidebarLinkWrapper>
        <Avatar src="" alt="Ruslan" />
        <SidebarLink>Account</SidebarLink>
      </SidebarLinkWrapper>
    </SidebarWrapper>
  );
};

export default Sidebar;
