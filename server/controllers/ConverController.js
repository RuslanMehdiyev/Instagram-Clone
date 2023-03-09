const Conversation = require("../models/Conversation");

const conversationController = {
  createConversation: async (req, res) => {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getConversationByUserId: async (req, res) => {
    const userId = req.params.userId;
    try {
      const conversation = await Conversation.find({
        members: { $in: [userId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getConversationByUserIds: async (req, res) => {
    const { firstUserId, secondUserId } = req.params;
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [firstUserId, secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = {
  conversationController,
};
