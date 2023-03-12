require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/UserRoute");
const authRouter = require("./routes/Auth");
const postRouter = require("./routes/PostRoute");
const imageRouter = require("./routes/ImageRoute");
const converRouter = require("./routes/ConverRoute");
const messageRouter = require("./routes/MessageRoute");

var jwt = require("jsonwebtoken");

const cors = require("cors");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const http = require("http");
const server = http.createServer(app);
mongoose.set("strictQuery", true);
let privateKey = process.env.PRIVATE_KEY;

app.use("/api/uploads", express.static("uploads"));

app.use((req, res, next) => {
  if (
    req.url === "/api/auth/login" ||
    req.url === "/api/auth/confirm" ||
    req.url === "/api/auth/register" ||
    req.url.startsWith("/api/uploads/")
  ) {
    return next();
  }

  let auth = req.headers.authorization?.split(" ");
  let token = "";
  if (auth) {
    if (auth.length === 2) {
      token = auth[1];
    } else {
      return res.status(401).json({ message: "Access Error!" });
    }
  } else {
    return res.status(401).json({ message: "Access Error!" });
  }

  jwt.verify(token, privateKey, function (err, decode) {
    if (err) {
      return res.status(401).json(err);
    } else {
      const newToken = jwt.sign({ email: decode.email }, privateKey, {
        expiresIn: "5h",
      });
      res.locals.token = newToken;
      next();
    }
  });
});

// middleware for send a new token in the response header if the original token has expired

app.use((req, res, next) => {
  if (res.locals.token) {
    res.setHeader("Authorization", `Bearer ${res.locals.token}`);
  }
  next();
});

mongoose
  .connect(process.env.DB_URL)
  .then((res) => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("Connection error!");
  });

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/upload", imageRouter);
app.use("/api/conversations", converRouter);
app.use("/api/message", messageRouter);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["https://ruso-insta.netlify.app", "http://127.0.0.1:5173"],
  },
});

const users = new Map();

const addUser = (userId, socketId) => {
  if (!users.has(userId)) {
    users.set(userId, new Set([socketId]));
  } else {
    users.get(userId).add(socketId);
  }
};

const removeUser = (socketId) => {
  for (const [userId, socketIds] of users) {
    if (socketIds.has(socketId)) {
      socketIds.delete(socketId);
      if (socketIds.size === 0) {
        users.delete(userId);
      }
      break;
    }
  }
};

const getUsers = () => {
  const userArr = [];
  for (const [userId, socketIds] of users) {
    userArr.push({ userId, socketIds: [...socketIds] });
  }
  return userArr;
};

const sendMessage = ({ senderId, receiverId, text }) => {
  const socketIds = users.get(receiverId);
  if (socketIds) {
    for (const socketId of socketIds) {
      io.to(socketId).emit("getMessage", { senderId, text });
    }
  }
};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", getUsers());
  });

  socket.on("sendMessage", (data) => {
    sendMessage(data);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", getUsers());
  });
});
