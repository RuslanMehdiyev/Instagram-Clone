import { useContext, useEffect, useState } from "react";
import PostCard from "../../components/cards/PostsCard";
import { api } from "../../network/api";
import { authContext } from "../../context/AuthContext";
import PropagateLoader from "react-spinners/PropagateLoader";
import ProfileCard from "../../components/cards/ProfileCard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Dialog } from "@mui/material";
import { Box } from "@mui/system";
import "../profile/profile.css";
function Explore() {
  const [posts, setPosts] = useState([]);
  const { currentUser, fetch } = useContext(authContext);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({});

  useEffect(() => {
    api
      .getAll("/posts")
      .then((res) => {
        setPosts(res.filter((a) => a.user._id !== currentUser._id));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
        console.log(posts);
      });
  }, [currentUser?._id, fetch]);

  const handleOpen = (item) => {
    setPost(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {loading ? (
        <PropagateLoader color="#36d7b7" />
      ) : (
        <div className="profile-page" style={{ marginTop: "0" }}>
          <div className="profile-body" style={{ borderTop: "none" }}>
            {posts.length > 0 ? (
              <div className="profile-post-grid">
                {posts
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((post) => (
                    <div
                      className="post-grid-item"
                      key={post._id}
                      onClick={() => handleOpen(post)}
                    >
                      <ProfileCard post={post} />
                      <div className="icon-wrapper">
                        <FavoriteIcon className="like-icon" />
                        <b>{post.likes && post.likes.length}</b>
                      </div>
                    </div>
                  ))}
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box>
                    <PostCard post={post} handleClose={handleClose} />
                  </Box>
                </Dialog>
              </div>
            ) : (
              <h2 style={{ textAlign: "center", marginTop: "4rem" }}>
                The posts of all users will be displayed in this section as soon
                as they add new content.
              </h2>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Explore;
