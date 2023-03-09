import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useNavigate } from "react-router-dom";
import { api } from "../../network/api";
import { authContext } from "../../context/AuthContext";

export const Comment = ({ comment, onLike, currentUser, postId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isReplyLiked, setReplyIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { fetch, setFetch } = useContext(authContext);
  const navigate = useNavigate();
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(comment._id, isLiked);
  };
  useEffect(() => {
    setIsLiked(comment.likes.some((like) => like._id === currentUser._id));
    comment.replies.forEach((reply) => {
      reply.isLiked = reply.likes.some((like) => like._id === currentUser._id);
    });
    setReplyIsLiked(comment.replies.some((reply) => reply.isLiked));
  }, []);

  const handleReplySubmit = (e, commentId, postId) => {
    e.preventDefault();
    console.log("commentId", commentId, "postId ", postId);
    if (replyText.trim().length == 0) {
      setReplyText("");
      return;
    }

    api
      .add(`/posts/${postId}/comments/${commentId}/replies`, {
        reply: replyText,
        userId: currentUser._id,
      })
      .then((res) => {
        setFetch(!fetch);
        setReplyText("");
        setShowReplyForm(false);
      })
      .catch((err) => console.log(err));
  };

  const handleReplyLike = (commentId, postId, replyId) => {
    const apiEndpoint = isReplyLiked
      ? `/posts/${postId}/comments/${commentId}/replies/${replyId}/dislike`
      : `/posts/${postId}/comments/${commentId}/replies/${replyId}/like`;
    api
      .add(apiEndpoint, {
        userId: currentUser._id,
      })
      .then(() => {
        setReplyIsLiked(!isReplyLiked);
        setFetch(!fetch);
      });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <Box display="flex" alignItems="center" mb="0.5rem">
        <Avatar alt={comment.user.userName} src={comment.user.avatar} />
        <Box ml="0.5rem">
          <Box display={"flex"} flexDirection={"row"} gap="10px">
            <b
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile/" + comment.user._id)}
            >
              {comment.user.userName}
            </b>
            <Typography variant="body2">{comment.comment}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleLike}>
              {isLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </IconButton>
            <Typography variant="caption">
              {comment.likes.length}{" "}
              {comment.likes.length === 1 ? "Like" : "Likes"}
            </Typography>
            <Box>
              <Button
                variant="text"
                color="primary"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {comment.replies.length > 0 &&
        comment.replies.map((reply) => (
          <Box
            key={reply._id}
            display="flex"
            alignItems="center"
            mb="0.5rem"
            ml="1rem"
          >
            <Avatar alt={reply.user.userName} src={reply.user.avatar} />
            <Box ml="0.5rem">
              <Box display={"flex"} flexDirection={"row"} gap="10px">
                <b
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/profile/" + reply.user._id)}
                >
                  {reply.user.userName}
                </b>
                <Typography variant="body2">{reply.reply}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() =>
                    handleReplyLike(comment._id, postId, reply._id)
                  }
                >
                  {isReplyLiked ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderOutlinedIcon />
                  )}
                </IconButton>
                <Typography variant="caption">
                  {reply.likes.length}{" "}
                  {reply.likes.length === 1 ? "Like" : "Likes"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      {showReplyForm && (
        <Box mt="0.5rem">
          <form onSubmit={(e) => handleReplySubmit(e, comment._id, postId)}>
            <Box display={"flex"} alignItems={"center"}>
              <TextField
                label="Add a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ height: "56px", marginTop: "5px" }}
              >
                Reply
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};
