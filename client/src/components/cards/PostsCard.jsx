import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Avatar,
  TextField,
  Button,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Comment } from "../comments/Comment";
import { api } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";

const PostCard = ({ post }) => {
  const [user, setUser] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post.likes.length);
  const [isSaved, setIsSaved] = useState(false);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setFetch, fetch } =
    useContext(authContext);

  useEffect(() => {
    api.getAll("/users/" + post.user._id).then((res) => setUser(res));
  }, [post?.user._id, post.likes]);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, []);

  useEffect(() => {
    setIsSaved(currentUser.savedPosts.includes(post._id));
  }, []);

  const handleLikeDislike = (postId, userId) => {
    if (isLiked) {
      api
        .update(`/posts/${postId}/dislike`, { userId })
        .then((res) => {
          setIsLiked(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .add(`/posts/${postId}/like`, { userId })
        .then((res) => {
          setIsLiked(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setLike(isLiked ? like - 1 : like + 1);
    setFetch(!fetch);
  };

  const handleSave = (userId, postId) => {
    api
      .add("/users/" + userId + "/save-post/" + postId)
      .then((res) => {
        const updatedUser = {
          ...currentUser,
          savedPosts: isSaved
            ? currentUser.savedPosts.filter((p) => p !== postId)
            : [...currentUser.savedPosts, postId],
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsSaved(!isSaved);
        setCurrentUser(updatedUser);
      })
      .catch((err) => console.log(err));
  };

  const handleCommentSubmit = (event, text, postId) => {
    event.preventDefault();
    if (text.trim().length == 0) {
      setText("");
      return;
    }
    api
      .update("/posts/" + postId + "/comments", {
        userId: currentUser._id,
        comment: text,
      })
      .then(() => {
        setFetch(!fetch), setText("");
      })
      .catch((err) => console.log(err));
  };

  const handleCommentLike = (commentId, isLiked, postId) => {
    console.log(isLiked);
    const apiEndpoint = isLiked
      ? `/posts/${postId}/comments/${commentId}/dislike`
      : `/posts/${postId}/comments/${commentId}/like`;
    api
      .update(apiEndpoint, {
        userId: currentUser._id,
      })
      .then(() => setFetch(!fetch));
  };

  const handleCommentReply = (id) => {
    setReplyTo(id);
  };

  return (
    <Box mt={"1rem"} p="1rem" maxWidth={"500px"} margin={"0 auto"}>
      <Card>
        <CardHeader
          onClick={() => navigate("/profile/" + user._id)}
          style={{ cursor: "pointer" }}
          avatar={
            <Avatar
              src={user.avatar ? user.avatar : ""}
              sx={{ width: 50, height: 50 }}
            />
          }
          title={
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              {user.userName}
            </Typography>
          }
        />
        <CardMedia
          style={{ width: "100%", height: "400px" }}
          component="img"
          image={post.image}
          alt={post.caption}
        />
        <CardActions
          disableSpacing
          style={{
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              border: "none",
              padding: "0",
              display: "flex",
              backgroundColor: "transparent",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => handleLikeDislike(post._id, currentUser._id)}
            >
              {isLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </IconButton>

            <Typography>
              {like} {like > 1 ? "Likes" : "Like"}
            </Typography>
          </div>
          <IconButton onClick={() => handleSave(currentUser._id, post._id)}>
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
          </IconButton>
        </CardActions>
        {post.caption && (
          <CardContent>
            <Typography>
              <>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "18px",
                    cursor: "pointer  ",
                  }}
                  onClick={() => navigate("/profile/" + user._id)}
                >
                  {user.userName}
                </button>
                <span style={{ marginLeft: "10px" }}>{post.caption}</span>
              </>
            </Typography>
          </CardContent>
        )}
        <CardContent>
          {post.comments.length > 0 &&
            post.comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onLike={(commentId, isLiked) =>
                  handleCommentLike(commentId, isLiked, post._id)
                }
                onReply={handleCommentReply}
                currentUser={currentUser}
              />
            ))}
          <form onSubmit={(e) => handleCommentSubmit(e, text, post._id)}>
            <TextField
              label="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostCard;
