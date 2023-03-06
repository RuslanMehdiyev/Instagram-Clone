const express = require("express");
const router = express.Router();
const { postController } = require("../controllers/PostController");

router.get("/", postController.getAll);
router.get("/:id", postController.getById);
router.post("/", postController.create);
router.put("/:id", postController.update);
router.delete("/:id", postController.delete);
// Like a post
router.post("/:id/like", postController.like);
router.put("/:id/dislike", postController.dislike);

// Comments routes
router.put("/:id/comments", postController.comment);
router.delete("/:id/comments/:commentId", postController.deleteComment);
router.put("/:id/comments/:commentId/like", postController.likeComment);
router.put("/:id/comments/:commentId/dislike", postController.dislikeComment);

// Reply to a comment
router.post("/:id/comments/:commentId/replies", postController.reply);
router.post(
  "/:id/comments/:commentId/replies/:replyId/like",
  postController.likeReply
);
router.post(
  "/:id/comments/:commentId/replies/:replyId/dislike",
  postController.dislikeReply
);

module.exports = router;
