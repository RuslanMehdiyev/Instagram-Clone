const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { postModel } = require("../models/Post");
const userModel = require("../models/User");

const postController = {
  getAll: (req, res) => {
    postModel
      .find({ isDeleted: false })
      .populate("user", "_id userName")
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "_id userName avatar" },
          { path: "likes", select: "_id userName" },
          {
            path: "replies",
            populate: [
              { path: "user", select: "_id userName avatar" },
              { path: "likes", select: "_id userName" },
            ],
          },
        ],
      })
      .exec((err, posts) => {
        if (!err) res.json(posts);
        else res.status(500).json(err);
      });
  },
  getById: (req, res) => {
    const postId = req.params.id;
    postModel
      .findById(postId)
      .populate("user", "_id userName")
      .populate("comments.user", "_id userName")
      .populate("comments.replies.user", "_id userName")
      .exec((err, post) => {
        if (!err) res.json(post);
        else res.status(500).json(err);
      });
  },
  create: (req, res) => {
    const post = new postModel({
      user: req.body.user,
      caption: req.body.caption,
      image: req.body.image,
    });

    post.save((err, doc) => {
      if (!err) res.json(doc);
      else res.status(500).json(err);
    });
  },

  update: (req, res) => {
    const postId = req.params.id;
    const update = {
      caption: req.body.caption,
      image: req.body.image,
    };

    postModel.findByIdAndUpdate(postId, update, { new: true }, (err, doc) => {
      if (!err) res.json(doc);
      else res.status(500).json(err);
    });
  },

  delete: (req, res) => {
    const postId = req.params.id;

    postModel.findByIdAndUpdate(
      postId,
      { isDeleted: true },
      { new: true },
      (err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      }
    );
  },

  like: (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;

    postModel.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true },
      (err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      }
    );
  },

  dislike: (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;

    postModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true },
      (err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      }
    );
  },
  comment: (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    const comment = {
      user: userId,
      comment: req.body.comment,
    };

    postModel
      .findByIdAndUpdate(
        postId,
        { $addToSet: { comments: comment } },
        { new: true }
      )
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "_id userName avatar" },
          { path: "likes", select: "_id userName" },
          { path: "replies.user", select: "_id userName avatar" },
          { path: "replies.likes", select: "_id userName" },
        ],
      })
      .exec((err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      });
  },
  deleteComment: (req, res) => {
    const { postId, commentId } = req.params;

    postModel.findById(postId, (err, post) => {
      if (err) {
        res.status(500).json(err);
      } else if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        const commentIndex = post.comments.findIndex(
          (comment) => comment._id.toString() === commentId
        );
        if (commentIndex === -1) {
          res.status(400).json({ message: "Comment not found" });
        } else {
          post.comments.splice(commentIndex, 1);
          post.save((err, doc) => {
            if (err) {
              res.status(500).json(err);
            } else {
              res.json(doc);
            }
          });
        }
      }
    });
  },
  likeComment: (req, res) => {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    postModel
      .findOneAndUpdate(
        { _id: id, "comments._id": commentId },
        { $addToSet: { "comments.$.likes": userId } },
        { new: true }
      )
      .populate("comments.user", "_id name")
      .populate("comments.likes", "_id name")
      .populate("comments.replies.user", "_id name")
      .populate("comments.replies.likes", "_id name")
      .exec((err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      });
  },

  dislikeComment: (req, res) => {
    const { id, commentId } = req.params;
    const { userId } = req.body;

    postModel
      .findOneAndUpdate(
        { _id: id, "comments._id": commentId },
        { $pull: { "comments.$.likes": userId } },
        { new: true }
      )
      .populate("comments.user", "_id userName")
      .populate("comments.likes", "_id userName")
      .populate("comments.replies.user", "_id userName")
      .populate("comments.replies.likes", "_id userName")
      .exec((err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      });
  },
  reply: (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    const commentId = req.params.commentId;

    userModel
      .findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const newReply = {
          _id: new ObjectId(),
          user: userId,
          userName: user.userName,
          avatar: user.avatar,
          reply: req.body.reply,
        };

        return postModel.findById(postId).then((post) => {
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }

          const comment = post.comments.id(commentId);
          if (!comment) {
            return res.status(400).json({ message: "Invalid comment ID" });
          }

          comment.replies.push(newReply);
          return post.save().then(() => {
            const response = {
              postId: postId,
              commentId: commentId,
              reply: {
                id: newReply._id,
                userName: newReply.userName,
                avatar: newReply.avatar,
                reply: newReply.reply,
              },
            };
            res.json(response);
          });
        });
      })
      .catch((err) => {
        console.log("Error:", err);
        res.status(500).json(err);
      });
  },
  likeReply: (req, res) => {
    const { id, commentId, replyId } = req.params;
    const userId = req.body.userId;
    postModel
      .findOneAndUpdate(
        {
          _id: id,
          "comments._id": commentId,
          "comments.replies._id": replyId,
        },
        { $addToSet: { "comments.$[comment].replies.$[reply].likes": userId } },
        {
          arrayFilters: [
            { "comment._id": commentId },
            { "reply._id": replyId },
          ],
          new: true,
        }
      )
      .populate("user", "_id userName")
      .populate("likes", "_id userName")
      .populate("comments.user", "_id userName")
      .populate("comments.likes", "_id userName")
      .populate("comments.replies.user", "_id userName")
      .populate("comments.replies.likes", "_id userName")
      .exec((err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      });
  },
  dislikeReply: (req, res) => {
    const { id, commentId, replyId } = req.params;
    const userId = req.body.userId;
    postModel
      .findOneAndUpdate(
        {
          _id: id,
          "comments._id": commentId,
          "comments.replies._id": replyId,
        },
        { $pull: { "comments.$[comment].replies.$[reply].likes": userId } },
        {
          arrayFilters: [
            { "comment._id": commentId },
            { "reply._id": replyId },
          ],
          new: true,
        }
      )
      .populate("comments.user", "_id userName")
      .populate("comments.likes", "_id userName")
      .populate("comments.replies.user", "_id userName")
      .populate("comments.replies.likes", "_id userName")
      .exec((err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      });
  },
};
module.exports = {
  postController,
};
