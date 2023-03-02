import { useState } from "react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

export const Comment = ({ comment, onLike, onReply }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies || []);

  const handleLike = () => {
    onLike(comment.id);
    setIsLiked(!isLiked);
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      mt="0.5rem"
    >
      <Box display="flex" alignItems="center" mb="0.5rem">
        <Box mr="0.5rem">
          <IconButton onClick={handleLike}>
            {isLiked ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
          </IconButton>
          <Typography variant="caption">
            {comment.likes} {comment.likes > 1 ? "Likes" : "Like"}
          </Typography>
        </Box>
        <Box mr="0.5rem">
          <Typography variant="subtitle2">{comment.text}</Typography>
        </Box>
        <Box>
          <Button variant="text" color="primary" onClick={handleReply}>
            Reply
          </Button>
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
            <IconButton>
              <FavoriteBorderOutlinedIcon />
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

export const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length == 0) {
      setText("");
      return;
    }
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};
