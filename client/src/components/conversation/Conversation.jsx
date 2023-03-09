import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../../network/api";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    api
      .getAll("/users/" + friendId)
      .then((res) => setUser(res))
      .catch((err) => console.log(err));
  }, [currentUser, conversation]);

  return (
    <ListItem button style={{ borderBottom: "1px solid gray" }}>
      <ListItemAvatar>
        <Avatar alt={""} src={user?.avatar} />
      </ListItemAvatar>
      <ListItemText primary={""} secondary={user?.userName} />
    </ListItem>
  );
};

export default Conversation;
