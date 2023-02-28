const express = require("express");
const { imageController } = require("../controllers/ImageController");
const { upload } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("imageUrl"), imageController.createImage);
router.get("/:filename", imageController.getImage);
module.exports = router;
