const Image = require("../models/Image");

const imageController = {
  createImage: async (req, res) => {
    try {
      let imageUrl = null;
      if (!req.file) {
        imageUrl = "";
      } else {
        const { filename } = req.file;
        imageUrl = `https://starfish-app-h9mfo.ondigitalocean.app/api/uploads/${filename}`;
      }
      const newImage = new Image({ imageUrl });
      const savedImage = await newImage.save();
      res.status(201).json(savedImage);
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ message: "Internal server errorrr" });
    }
  },
  getImage: async (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, "uploads", filename);
    res.sendFile(imagePath);
  },
};

module.exports = {
  imageController,
};
