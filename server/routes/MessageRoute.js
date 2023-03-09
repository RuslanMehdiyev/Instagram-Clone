const router = require("express").Router();
const { messageController } = require("../controllers/messageController");

router.post("/", messageController.addMessage);
router.get("/:conversationId", messageController.getMessagesByConversationId);

module.exports = router;
