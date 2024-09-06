const Conversation = require("../../models/Conversation");

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const convos = await Conversation.find({ participants: userId })
    .populate("participants")
    .populate({
      path: "messages",
      populate: [
        { path: "participants" },
        { path: "sentBy" },
        {
          path: "post",
          populate: { path: "user" },
        },
      ],
    });  

    res.status(200).json(convos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getConversations,
};
