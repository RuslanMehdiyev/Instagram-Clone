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
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Comment, CommentForm } from "../comments/Comment";
import { api } from "../../network/api";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const [user, setUser] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    api.getAll("/users/" + post.user._id).then((res) => setUser(res));
  }, [post?.user._id]);
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
          onClick={() => navigate("/profile/" + user._id)}
          style={{ cursor: "pointer" }}
          title={user.userName}
          action={
            <IconButton>
              <MoreHorizOutlinedIcon />
            </IconButton>
          }
        />
        <CardMedia
          style={{ width: "100%", height: "400px" }}
          component="img"
          image={post.image}
          alt={post.caption}
        />
        <CardActions disableSpacing>
          <IconButton onClick={handleLike}>
            {isLiked ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
          </IconButton>
          <Typography>
            {post.likes} {post.likes > 1 ? "Likes" : "Like"}
          </Typography>
          <IconButton onClick={handleSave}>
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
          </IconButton>
        </CardActions>
        <CardContent>
          <Typography>
            <strong>{user.userName} </strong>
            {post.caption}
          </Typography>
        </CardContent>
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
