import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/AuthContext";
import { api } from "../../network/api";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState({});
  const { selectedConversation, setSelectedConversation } =
    useContext(authContext);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    api
      .getAll("/users/" + friendId)
      .then((res) => setUser(res))
      .catch((err) => console.log(err));
  }, [currentUser, conversation]);

  const handleClick = () => {
    setSelectedConversation(conversation);
  };

  const isSelected =
    selectedConversation && selectedConversation._id === conversation._id;

  return (
    <ListItem
      button
      selected={isSelected}
      onClick={handleClick}
      style={{ backgroundColor: isSelected ? "#eee" : "white" }}
    >
      <ListItemAvatar>
        <Avatar alt={""} src={user?.avatar} />
      </ListItemAvatar>
      <ListItemText primary={""} secondary={user?.userName} />
    </ListItem>
  );
};

export default Conversation;
