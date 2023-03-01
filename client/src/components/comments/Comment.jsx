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
    setShowReplyForm(true);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
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
          <Typography variant="caption">{comment.likes} likes</Typography>
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
            <Typography variant="caption">{reply.likes} likes</Typography>
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
            />
            <Button type="submit" variant="contained" color="primary">
              Post
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
      />
      <Button type="submit" variant="contained" color="primary">
        Post
      </Button>
    </form>
  );
};

export const ReplyForm = ({ commentId, onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text);
    setText("");
  };

  return (
    <Box ml="1rem" mt="0.5rem">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Reply to this comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Post
        </Button>
      </form>
    </Box>
  );
};
