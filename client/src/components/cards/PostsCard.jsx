import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useState } from "react";
import { Box } from "@mui/system";
import { Comment, CommentForm } from "../comments/Comment";

const PostCard = ({ username, imageUrl, caption, likes, saved }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(saved);
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleCommentSubmit = (text) => {
    const newComment = { id: comments.length + 1, text, likes: 0 };
    setComments([...comments, newComment]);
  };

  const handleCommentLike = (id) => {
    const newComments = comments.map((comment) =>
      comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
    );
    setComments(newComments);
  };

  const handleCommentReply = (id) => {
    setReplyTo(id);
  };

  return (
    <Box mt={"1rem"} p="1rem" maxWidth={"500px"}>
      <Card>
        <CardHeader
          title={username}
          action={
            <IconButton>
              <MoreHorizOutlinedIcon />
            </IconButton>
          }
        />
        <CardMedia
          style={{ width: "100%", height: "400px" }}
          component="img"
          image={imageUrl}
          alt={caption}
        />
        <CardContent>
          <Typography>
            <strong>{username.substring(0, 5)} </strong>
            {caption}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={handleLike}>
            {isLiked ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
          </IconButton>
          <IconButton onClick={handleSave}>
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
          </IconButton>
          <Typography>{likes} likes</Typography>
        </CardActions>
        <CardContent>
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onLike={handleCommentLike}
              onReply={handleCommentReply}
            />
          ))}
          <CommentForm onSubmit={handleCommentSubmit} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostCard;
