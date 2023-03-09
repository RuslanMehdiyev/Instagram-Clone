const { default: mongoose, Schema } = require("mongoose");

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
