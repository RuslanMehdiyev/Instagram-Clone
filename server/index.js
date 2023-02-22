require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const userRouter = require("./routes/UserRoute");
const authRouter = require("./routes/Auth");
const postRouter = require("./routes/PostRoute");
// const commentRouter = require("./routes/CommentRoute");

var jwt = require("jsonwebtoken");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const http = require("http");
const server = http.createServer(app);
mongoose.set("strictQuery", true);
let privateKey = process.env.PRIVATE_KEY;

// app.use((req, res, next) => {
//   if (req.url == "/api/users/login" || req.url == "/api/users/confirmCode") {
//     return next();
//   }

//   let auth = req.headers.authorization?.split(" ");
//   let token = "";

//   if (auth) {
//     if (auth.length == 2) {
//       token = auth[1];
//     } else {
//       res.status(401).json({ message: "Access Error!" });
//     }
//   } else {
//     res.status(401).json({ message: "Access Error!" });
//   }

//   jwt.verify(token, privateKey, function (err, decode) {
//     if (err) {
//       res.status(401).json(err);
//     } else {
//       next();
//     }
//   });
// });

mongoose
  .connect(process.env.DB_URL)
  .then((res) => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("Connection error!");
  });

app.use("/api/users", userRouter);
app.use("/auth", authRouter);
app.use("/api/posts", postRouter);
// app.use("/api/posts/comment", commentRouter);

server.listen(8080, () => {
  console.log("listening on *:8080");
});
