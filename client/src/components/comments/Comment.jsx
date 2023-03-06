import { useEffect, useState } from "react";
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

export const Comment = ({ comment, onLike, currentUser }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isReplyLiked, setReplyIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);
  const navigate = useNavigate();
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(comment._id, isLiked);
  };
  useEffect(() => {
    setIsLiked(comment.likes.some((like) => like._id === currentUser._id));
  }, []);

  const handleReplyLike = () => {
    setReplyIsLiked(!isReplyLiked);
  };
  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim().length == 0) {
      setReplyText("");
      return;
    }
    const newReply = {
      id: new Date().getTime(),
      text: replyText,
      likes: 0,
    };
    setReplies([...replies, newReply]);
    setReplyText("");
    setShowReplyForm(false);
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
              <Button variant="text" color="primary" onClick={handleReply}>
                Reply
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {replies.map((reply) => (
        <Box
          key={reply.id}
          display="flex"
          alignItems="center"
          mb="0.5rem"
          ml="1rem"
        >
          <Box mr="0.5rem">
            <IconButton onClick={handleReplyLike}>
              {isReplyLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </IconButton>
            <Typography variant="caption">
              {reply.likes} {reply.likes > 1 ? "Likes" : "Like"}
            </Typography>
          </Box>
          <Box mr="0.5rem">
            <Typography variant="subtitle2">{reply.text}</Typography>
          </Box>
        </Box>
      ))}
      {showReplyForm && (
        <Box mt="0.5rem">
          <form onSubmit={handleReplySubmit}>
            <TextField
              label="Add a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Reply
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};
