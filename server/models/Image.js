const { default: mongoose, Schema } = require("mongoose");

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Image = mongoose.model("image", imageSchema);

module.exports = Image;
