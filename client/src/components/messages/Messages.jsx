import { useEffect, useState } from "react";
import TimeAgo from "react-timeago";
import { Box, Avatar, Typography } from "@mui/material";
import { api } from "../../network/api";
import { useNavigate } from "react-router-dom";

const Message = ({ own, message, user, currentChat }) => {
  const [receiverUser, setReceiverUser] = useState();
  const receiver = currentChat.members.find((e) => e !== user._id);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getAll("/users/")
      .then((res) => setReceiverUser(res.filter((u) => u._id === receiver)))
      .catch((err) => console.log(err));
  }, [receiver]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: own ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: own ? "0 0 0 auto" : "0",
        }}
      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate(
              own ? `/profile/${user._id}` : `/profile/${receiverUser[0]._id}`
            )
          }
        >
          <Avatar
            src={
              own ? user && user.avatar : receiverUser && receiverUser[0].avatar
            }
            alt="Avatar"
          />
        </div>
        <Typography
          sx={{
            backgroundColor: own ? "#1976d2" : "#f2f2f2",
            color: own ? "#fff" : "#333",
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "100%",
            wordBreak: "break-word",
            marginLeft: own ? "10px" : "10px",
            marginRight: own ? "0" : "30px",
          }}
        >
          {message.text}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "12px", color: "#888" }}>
        <TimeAgo date={message.createdAt} />
      </Typography>
    </Box>
  );
};

export default Message;
