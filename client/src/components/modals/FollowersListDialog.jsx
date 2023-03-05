import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Avatar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

const FollowersListDialog = ({ userList, open, onClose }) => {
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="user-list-dialog-title"
    >
      <DialogTitle id="user-list-dialog-title">Followings</DialogTitle>
      <DialogContent>
        <List>
          {userList.length ? (
            userList.map((user) => (
              <ListItem
                key={user._id}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  gap: "1rem",
                }}
                onClick={() => {
                  navigate("/profile/" + user._id);
                  onClose();
                }}
              >
                <Avatar src={user.avatar} sx={{ width: 47, height: 47 }} />
                <Box>
                  <Typography fontWeight={"bold"}>{user.userName}</Typography>
                  <Typography fontSize={"12px"}>
                    {user.fullName && user.fullName}
                  </Typography>
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography>Empty</Typography>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersListDialog;
