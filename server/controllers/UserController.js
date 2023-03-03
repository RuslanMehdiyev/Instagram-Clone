const userModel = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
  getAll: (req, res) => {
    userModel
      .find({ isDeleted: false })
      .select("_id fullName userName  email")
      .exec((err, docs) => {
        if (!err) {
          res.json(docs);
        } else {
          res.status(500).json(err);
        }
      });
  },
  getById: (req, res) => {
    const id = req.params.id;
    userModel.findById(id, (err, doc) => {
      if (!err) {
        if (doc) {
          res.json(doc);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } else {
        res.status(500).json(err);
      }
    });
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { fullName, userName, password, avatar, bio } = req.body;

    if (!fullName || !userName) {
      res.status(400).json({ message: "Full name and username are required" });
      return;
    }

    try {
      const existingUser = await userModel.findOne({ userName: userName });
      if (existingUser && existingUser._id.toString() !== id) {
        res.status(400).json({ message: "Username already exists" });
        return;
      }

      const user = await userModel.findById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.fullName = fullName;
      user.userName = userName;
      if (avatar) {
        user.avatar = avatar;
      }
      user.bio = bio;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  delete: (req, res) => {
    const id = req.params.id;
    userModel.findById(id, (err, doc) => {
      if (!err) {
        if (doc) {
          doc.isDeleted = true;
          doc.save((err, deletedDoc) => {
            if (!err) {
              res.json(deletedDoc);
            } else {
              res.status(500).json(err);
            }
          });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } else {
        res.status(500).json(err);
      }
    });
  },
  followUser: (req, res) => {
    const { userId, followUserId } = req.body;
    userModel.updateOne(
      { _id: userId },
      { $push: { following: followUserId } },
      (err, result) => {
        if (!err) {
          userModel.updateOne(
            { _id: followUserId },
            { $push: { followers: userId } },
            (err, result) => {
              if (!err) {
                res.json({ message: "User followed successfully" });
              } else {
                res.status(500).json(err);
              }
            }
          );
        } else {
          res.status(500).json(err);
        }
      }
    );
  },
  unfollowUser: (req, res) => {
    const { userId, unfollowUserId } = req.body;
    userModel.updateOne(
      { _id: userId },
      { $pull: { following: unfollowUserId } },
      (err, result) => {
        if (!err) {
          userModel.updateOne(
            { _id: unfollowUserId },
            { $pull: { followers: userId } },
            (err, result) => {
              if (!err) {
                res.json({ message: "User unfollowed successfully" });
              } else {
                res.status(500).json(err);
              }
            }
          );
        } else {
          res.status(500).json(err);
        }
      }
    );
  },
  savePost: async (req, res) => {
    const { userId, postId } = req.params;
    try {
      const user = await userModel.findById(userId);
      const post = await userModel.findById(postId);

      if (!user || !post) {
        return res.status(404).json({ message: "User or post not found" });
      }

      const postIndex = user.savedPosts.indexOf(postId);
      if (postIndex === -1) {
        user.savedPosts.push(postId);
      } else {
        user.savedPosts.splice(postIndex, 1);
      }

      await user.save();

      res.json({ message: "Post saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = {
  userController,
};
