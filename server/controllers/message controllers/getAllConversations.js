const Conversation = require('../../models/Conversation');

const getConversations = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const convos = await Conversation.find({ sender: userId })
      .populate("sender")
      .populate("receivers")
      .populate("messages")
  
      res.status(200).json(convos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = {
    getConversations
  };