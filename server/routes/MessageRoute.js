const router = require("express").Router();
const { messageController } = require("../controllers/MessageController");

router.post("/", messageController.addMessage);
router.get("/:conversationId", messageController.getMessagesByConversationId);

module.exports = router;
