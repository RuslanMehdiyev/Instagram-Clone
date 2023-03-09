const express = require("express");
const router = express.Router();
const { conversationController } = require("../controllers/ConverController");

router.post("/", conversationController.createConversation);
router.get("/:userId", conversationController.getConversationByUserId);
router.get(
  "/:firstUserId/:secondUserId",
  conversationController.getConversationByUserIds
);

module.exports = router;
