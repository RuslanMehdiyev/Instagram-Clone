import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  List,
  TextField,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/messages/Messages";
import { authContext } from "../../context/AuthContext";
import { io } from "socket.io-client";
import { api } from "../../network/api";

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  const scrollRef = useRef();

  const { currentUser, currentChat, setCurrentChat, setSelectedConversation } =
    useContext(authContext);

  useEffect(() => {
    socket.current = io("https://blooming-headland-23532.herokuapp.com/");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    api
      .getAll("/conversations/" + currentUser?._id)
      .then((res) => {
        setConversations(res);
      })
      .catch((err) => console.log(err));
  }, [currentUser?._id]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.following.filter((f) => users.some((u) => u.userId === f))
      );
    });
    return () => {
      setCurrentChat(null);
      setSelectedConversation(null);
    };
  }, [currentUser]);

  useEffect(() => {
    api
      .getAll("/message/" + currentChat?._id)
      .then((res) => setMessages(res))
      .catch((err) => console.log(err));
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim().length === 0) {
      return;
    }
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );

    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId,
      text: newMessage,
    });

    api
      .add("/message", message)
      .then((res) => {
        setMessages([...messages, res]);
        setNewMessage("");
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: { xs: "90%", sm: "75%", md: "60%" },
        marginTop: { xs: "40px", sm: 0 },
        margin: "0 auto",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              height: { md: "calc(100vh - 40px)", xs: "100px", sm: "80%" },
              overflow: "auto",
              marginTop: { xs: "2rem", sm: "2rem", md: "10px" },
            }}
          >
            <List>
              <div>
                {conversations?.map((c) => (
                  <div onClick={() => setCurrentChat(c)} key={c._id}>
                    <Conversation conversation={c} currentUser={currentUser} />
                  </div>
                ))}
              </div>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper
            sx={{
              height: "calc(100vh - 40px)",
              display: "flex",
              flexDirection: "column",
              maxHeight: { xs: "70%", sm: "80%", md: "100%" },
              marginTop: { sm: "2rem", md: "10px" },
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                overflow: "auto",
                height: { md: "calc(100vh - 40px)", xs: "100px", sm: "80%" },
              }}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              {currentChat ? (
                <>
                  <div className="chat-box-top">
                    {messages?.map((m, index) => (
                      <div ref={scrollRef} key={index}>
                        <Message
                          message={m}
                          own={m.sender === currentUser._id}
                          user={currentUser}
                          currentChat={currentChat}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="chat-box-bottom">
                    <form onSubmit={handleSubmit}>
                      <Box display="flex" mt={"10px"}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Write something..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <IconButton color="primary" type="submit">
                          <SendOutlinedIcon />
                        </IconButton>
                      </Box>
                    </form>
                  </div>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6">Start a Chat</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Messenger;
