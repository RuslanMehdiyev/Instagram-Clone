const { default: mongoose, Schema } = require("mongoose");

const replySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reply: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [replySchema],
  },
  { timestamps: true }
);

commentSchema.virtual("userName", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
  select: "userName",
});
commentSchema.virtual("repliesWithUserInfo", {
  ref: "Reply",
  localField: "replies",
  foreignField: "_id",
  justOne: false,
  options: { sort: { createdAt: -1 } },
  populate: { path: "user", select: "userName avatar" },
});

const Comment = mongoose.model("Comment", commentSchema);
const Reply = mongoose.model("Reply", replySchema);

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    caption: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = { Reply, Comment, postModel };
