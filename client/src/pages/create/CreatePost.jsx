import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  FormControl,
  TextField,
} from "@mui/material";
import { api } from "../../network/api";

const CreatePost = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCaptionInput = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("imageUrl", selectedFile);

    try {
      const res = await api.createPost("/upload", formData);
      const imageUrl = res.imageUrl;
      const postData = {
        user: user._id,
        caption: caption,
        image: imageUrl,
      };

      const createPostRes = await api.add("/posts", postData);

      console.log("Post created successfully:", createPostRes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <input
            accept="image/jpeg,image/png"
            style={{ display: "none" }}
            id="image-input"
            type="file"
            onChange={handleFileInput}
            name="imageUrl"
          />
          <label htmlFor="image-input">
            <Button variant="contained" component="span">
              Select Image
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
        <Divider sx={{ my: 2 }} />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Caption"
            multiline
            rows={3}
            value={caption}
            onChange={handleCaptionInput}
          />
        </FormControl>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedFile}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreatePost;
