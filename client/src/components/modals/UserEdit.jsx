import React, { useContext, useState } from "react";
import {
  Button,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { api } from "../../network/api";
import { toast, ToastContainer } from "react-toastify";
import { authContext } from "../../context/AuthContext";

const UserModal = ({ open, handleClose, currentUser, fetch, setFetch }) => {
  const [username, setUsername] = useState(currentUser.userName);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { setCurrentUser } = useContext(authContext);

  const handleAvatarInput = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("imageUrl", avatar);
    let imageUrl = null;
    try {
      if (!Object.keys(formData).length) {
        const res = await api.createPost("/upload", formData);
        imageUrl = res?.imageUrl;
      }
      const updatedUser = {
        fullName: fullName ?? currentUser.fullName,
        userName: username ?? currentUser.userName,
        bio: bio ?? currentUser.bio,
        avatar: imageUrl ?? currentUser.avatar,
      };

      const newUserInfo = await api.update(
        "/users/" + currentUser._id,
        updatedUser
      );
      localStorage.setItem("user", JSON.stringify(newUserInfo));
      setCurrentUser(newUserInfo);
      handleClose();
      setFetch(!fetch);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <ToastContainer />
      <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
      <DialogContent>
        <DialogContentText>Update your information below:</DialogContentText>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              id="image-input"
              type="file"
              onChange={handleAvatarInput}
              name="imageUrl"
            />
            <label htmlFor="image-input">
              <Button variant="contained" component="span">
                Select Avatar
              </Button>
            </label>
            {previewImage && (
              <CardMedia
                component="img"
                src={previewImage}
                alt="Preview"
                sx={{ width: "200px", height: "auto", ml: 2 }}
              />
            )}
          </Box>
        </CardContent>
        <TextField
          margin="dense"
          label="FullName"
          type="text"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Bio"
          type="text"
          fullWidth
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
