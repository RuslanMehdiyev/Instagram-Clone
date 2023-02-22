const postModel = require("../models/Post");

const postController = {
  getAll: (req, res) => {
    postModel
      .find({ isDeleted: false })
      .populate("user", "_id name")
      .populate("comments.user", "_id name")
      .populate("comments.replies.user", "_id name")
      .exec((err, posts) => {
        if (!err) res.json(posts);
        else res.status(500).json(err);
      });
  },
  getById: (req, res) => {
    const postId = req.params.id;
    postModel
      .findById(postId)
      .populate("user", "_id name")
      .populate("comments.user", "_id name")
      .populate("comments.replies.user", "_id name")
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
      .populate("comments.user", "_id name")
      .populate("comments.likes", "_id name")
      .populate("comments.replies.user", "_id name")
      .populate("comments.replies.likes", "_id name")
      .exec((err, doc) => {
        if (!err) res.json(doc);
        else res.status(500).json(err);
      });
  },
  deleteComment: (req, res) => {
    const postId = req.params.id;
    const commentIndex = req.params.commentIndex;

    postModel.findById(postId, (err, post) => {
      if (err) {
        res.status(500).json(err);
      } else if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        const comments = post.comments;
        if (commentIndex < 0 || commentIndex >= comments.length) {
          res.status(400).json({ message: "Invalid comment index" });
        } else {
          comments.splice(commentIndex, 1);
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
    const { id, commentIndex } = req.params;
    const userId = req.body.userId;

    console.log(`id: ${id}, commentIndex: ${commentIndex}, userId: ${userId}`);

    postModel
      .findOneAndUpdate(
        { _id: id, "comments._id": commentIndex },
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
    const { id, commentIndex } = req.params;
    const userId = req.body.userId;

    postModel
      .findOneAndUpdate(
        { _id: id, "comments._id": commentIndex },
        { $pull: { "comments.$.likes": userId } },
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
  reply: (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId;
    const commentIndex = req.params.commentIndex; // the index of the comment in the comments array
    const reply = {
      user: userId,
      reply: req.body.reply,
    };

    postModel.findById(postId, (err, post) => {
      if (err) {
        res.status(500).json(err);
      } else if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        const comments = post.comments;
        if (commentIndex < 0 || commentIndex >= comments.length) {
          res.status(400).json({ message: "Invalid comment index" });
        } else {
          comments[commentIndex].replies.push(reply);
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
  likeReply: (req, res) => {
    const { id, commentIndex, replyIndex } = req.params;
    const userId = req.body.userId;
    postModel
      .findOneAndUpdate(
        {
          _id: id,
          "comments._id": commentIndex,
          "comments.replies._id": replyIndex,
        },
        { $addToSet: { "comments.$[comment].replies.$[reply].likes": userId } },
        {
          arrayFilters: [
            { "comment._id": commentIndex },
            { "reply._id": replyIndex },
          ],
          new: true,
        }
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
  dislikeReply: (req, res) => {
    const { id, commentIndex, replyIndex } = req.params;
    const userId = req.body.userId;
    postModel
      .findOneAndUpdate(
        {
          _id: id,
          "comments._id": commentIndex,
          "comments.replies._id": replyIndex,
        },
        { $pull: { "comments.$[comment].replies.$[reply].likes": userId } },
        {
          arrayFilters: [
            { "comment._id": commentIndex },
            { "reply._id": replyIndex },
          ],
          new: true,
        }
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
};
module.exports = {
  postController,
};
