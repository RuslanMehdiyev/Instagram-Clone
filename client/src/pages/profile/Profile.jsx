import { Avatar, Button } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../store/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../network/api";
import "./profile.css";
import ProfileCard from "../../components/cards/ProfileCard";
function Profile() {
  const [user, setUser] = useState([]);
  const [followed, setFollowed] = useState(true);
  const [posts, setPosts] = useState([]);
  const [fetch, setFetch] = useState(false);
  const { currentUser, setLoginStatus } = useContext(authContext);
  const navigate = useNavigate();
  const userId = useParams().id;

  useEffect(() => {
    api.getAll("/users/" + userId).then((res) => setUser(res));
  }, [userId]);

  useEffect(() => {
    api.getAll("/posts").then((res) => {
      setPosts(res.filter((a) => a.user?._id === userId));
    });
  }, [userId, fetch]);

  const deletePost = (id) => {
    if (window.confirm("Are you sure?")) {
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
      setLoginStatus(false);
      navigate("/");
    }
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-header-left">
            <Avatar
              src={user.avatar ? user.avatar : ""}
              sx={{ width: 150, height: 150 }}
            />
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
                    // onClick={handleClick}
                  >
                    {followed ? "Unfollow" : "Follow"}
                  </Button>
                ) : (
                  <Button variant="contained" size="small">
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
                <b>{posts.length}</b>
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
              <button className="active">
                <GridOnOutlinedIcon />
                <span>POSTS</span>
              </button>
              <button>
                <BookmarkAddOutlinedIcon />
                <span>SAVED</span>
              </button>
            </div>
          )}

          <div className="profile-post-grid">
            {posts.map((post) => (
              <div className="post-grid-item" key={post._id}>
                <ProfileCard post={post} />
                <div className="icon-wrapper">
                  <FavoriteIcon className="like-icon" />
                  <b>{post.likes && post.likes.length}</b>
                  {user?._id === currentUser?._id && (
                    <button
                      style={{ background: "none", border: "none" }}
                      onClick={() => deletePost(post._id)}
                    >
                      <DeleteOutlineOutlinedIcon className="delete-icon" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
