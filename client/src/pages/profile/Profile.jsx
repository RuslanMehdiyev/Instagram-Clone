import { Avatar, Button, Dialog } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../network/api";
import "./profile.css";
import ProfileCard from "../../components/cards/ProfileCard";
import UserModal from "../../components/modals/UserEdit";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Box } from "@mui/system";
import PostCard from "../../components/cards/PostsCard";

function Profile() {
  const [user, setUser] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLength, setPostsLength] = useState(0);
  const [post, setPost] = useState({});
  const [toggle, setToggle] = useState(true);
  const [fetch, setFetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { currentUser, setLoginStatus, setCurrentUser } =
    useContext(authContext);
  const navigate = useNavigate();
  const userId = useParams().id;

  useEffect(() => {
    api
      .getAll("/users/" + userId)
      .then((res) => setUser(res))
      .finally(() => setLoading(false));
  }, [userId, fetch]);

  useEffect(() => {
    setFollowed(currentUser.following.includes(userId));
  }, [followed]);

  useEffect(() => {
    api.getAll("/posts").then((res) => {
      setPosts(res);
      setPostsLength(res.filter((a) => a.user?._id === userId).length);
    });
  }, [userId, fetch]);

  const deletePost = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      api.delete("/posts/" + id).then((res) => {
        if (res.status == 200) {
          setFetch(!fetch);
        }
      });
    }
  };

  const handleLogOut = () => {
    if (window.confirm("Are you sure?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setCurrentUser(null);
      setLoginStatus(false);
      navigate("/");
    }
  };

  const handleFollowUnfollow = (userId, followUserId) => {
    if (followed) {
      api
        .add(`/users/unfollow`, { userId, followUserId })
        .then((res) => {
          const updatedUser = {
            ...currentUser,
            following: currentUser.following.filter(
              (id) => id !== followUserId
            ),
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setFollowed(false);
          setCurrentUser(updatedUser);
          setFetch(!fetch);
        })
        .catch((err) => console.log(err));
    } else {
      api
        .add(`/users/follow`, { userId, followUserId })
        .then((res) => {
          const updatedUser = {
            ...currentUser,
            following: [...currentUser.following, followUserId],
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setFollowed(true);
          setCurrentUser(updatedUser);
          setFetch(!fetch);
        })
        .catch((err) => console.log(err));
    }
  };

  const detailModal = (item) => {
    setDetailsOpen(true);
    setPost(item);
  };

  const handleClose = () => {
    setOpen(false);
    setDetailsOpen(false);
  };

  return (
    <>
      {loading ? (
        <PropagateLoader color="#36d7b7" />
      ) : (
        <>
          <div className="profile-page">
            <div className="profile-header">
              <div className="profile-header-left">
                <Button>
                  <Avatar
                    src={user.avatar ? user.avatar : ""}
                    sx={{ width: 150, height: 150 }}
                  />
                </Button>
              </div>
              <div className="profile-header-right">
                <div className="profile-header-top">
                  <span className="profile-page-username">{user.userName}</span>
                  <div className="profile-buttons">
                    {user?._id !== currentUser?._id ? (
                      <Button
                        variant="contained"
                        size="small"
                        color={followed ? "error" : "success"}
                        onClick={() =>
                          handleFollowUnfollow(currentUser._id, userId)
                        }
                      >
                        {followed ? "Unfollow" : "Follow"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setOpen(true)}
                      >
                        Edit
                      </Button>
                    )}

                    {user?._id === currentUser?._id ? (
                      <button>
                        <SettingsOutlinedIcon />
                      </button>
                    ) : (
                      <button
                      // onClick={createConversation}
                      >
                        <MailOutlineIcon />
                      </button>
                    )}
                    {user?._id === currentUser?._id && (
                      <button onClick={handleLogOut}>
                        <LogoutOutlinedIcon color="error" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="profile-header-middle">
                  <div className="post-count">
                    <b>{postsLength}</b>
                    <span>posts</span>
                  </div>
                  <div className="follower-count">
                    <b>{user.followers && user.followers.length}</b>
                    <span>followers</span>
                  </div>
                  <div className="following-count">
                    <b>{user.following && user.following.length}</b>
                    <span>following</span>
                  </div>
                </div>
                <div className="head-right-bottom">
                  <b>{user.fullName}</b>
                  <span>{user.bio && user.bio}</span>
                </div>
              </div>
            </div>
            <div className="profile-body">
              {user?._id === currentUser?._id && (
                <div className="profile-nav-tabs">
                  <button
                    className={toggle ? "active" : ""}
                    onClick={() => setToggle(true)}
                  >
                    <GridOnOutlinedIcon />
                    <span>POSTS</span>
                  </button>
                  <button
                    className={toggle ? "" : "active"}
                    onClick={() => setToggle(false)}
                  >
                    <BookmarkAddOutlinedIcon />
                    <span>SAVED</span>
                  </button>
                </div>
              )}
              <div className="profile-post-grid">
                {toggle ? (
                  posts
                    .filter((a) => a.user?._id === userId)
                    .map((post) => (
                      <div
                        className="post-grid-item"
                        key={post._id}
                        onClick={() => detailModal(post)}
                      >
                        <ProfileCard post={post} />
                        <div className="icon-wrapper">
                          <FavoriteIcon className="like-icon" />
                          <b>{post.likes && post.likes.length}</b>
                          {user?._id === currentUser?._id && (
                            <button
                              style={{ background: "none", border: "none" }}
                              onClick={(event) => {
                                event.stopPropagation();
                                deletePost(post._id);
                              }}
                            >
                              <DeleteOutlineOutlinedIcon className="delete-icon" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                ) : currentUser.savedPosts.length ? (
                  posts
                    .filter((post) => currentUser.savedPosts.includes(post._id))
                    .map((filteredPost) => (
                      <div
                        className="post-grid-item"
                        key={filteredPost._id}
                        onClick={() => detailModal(filteredPost)}
                      >
                        <ProfileCard post={filteredPost} />
                        <div className="icon-wrapper">
                          <FavoriteIcon className="like-icon" />
                          <b>
                            {filteredPost.likes && filteredPost.likes.length}
                          </b>
                        </div>
                      </div>
                    ))
                ) : (
                  <>
                    <span></span>
                    <h2 style={{ textAlign: "center", marginTop: "1rem" }}>
                      There are no saved publications
                    </h2>
                  </>
                )}
              </div>
            </div>
          </div>
          <UserModal
            open={open}
            handleClose={handleClose}
            currentUser={currentUser}
            setFetch={setFetch}
            fetch={fetch}
          />
          <Dialog
            open={detailsOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>
              <PostCard post={post} />
            </Box>
          </Dialog>
        </>
      )}
    </>
  );
}

export default Profile;
