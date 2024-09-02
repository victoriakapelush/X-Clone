const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const User = require('../../models/User');
const { format } = require("date-fns");

const createConversation = async (req, res) => {
  try {
    const { participants } = req.body; // Expecting `participants` to be an array of user IDs
    const currentUser = req.user.id;

    // Ensure the current user is included in the participants list
    if (!participants.includes(currentUser)) {
      participants.push(currentUser);
    }

    // Validate that there are at least two participants
    if (participants.length < 2) {
      return res.status(400).json({ message: "At least two participants are required." });
    }

    const postDate = new Date();
    const formattedTime = format(postDate, "PPpp");

    // Check if a conversation already exists with the exact same participants
    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length }
    });

    // If a conversation already exists, return an error or the existing conversation
    if (conversation) {
      return res.status(400).json({ message: "Conversation already exists." });
    }

    // Create a new conversation
    conversation = new Conversation({
      participants,
      messages: [],
      updatedAt: formattedTime,
    });

    await conversation.save();

    // Add the conversation to each participant's User model
    await Promise.all(
      participants.map((participantId) =>
        User.findByIdAndUpdate(participantId, {
          $push: { conversations: conversation._id }
        })
      )
    );

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addMessageToConversation = async (req, res) => {
  try {
    const { text, image, gif } = req.body;
    const currentUser = req.user.id;
    const {conversationId} = req.params;

    const postDate = new Date();
    const formattedTime = format(postDate, "PPpp");

    // Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    // Create a new message
    const message = new Message({
      participants: conversation.participants,
      text,
      image,
      gif,
      conversation: conversation._id,
      time: formattedTime,
      sentBy: currentUser
    });

    await message.save();

    // Add the new message to the conversation
    await Conversation.findByIdAndUpdate(conversation._id, {
      $push: { messages: message._id },
      $set: { lastMessage: message._id, updatedAt: formattedTime }
    });

    // Update the User models for all participants
    for (const participant of conversation.participants) {
      await User.findByIdAndUpdate(participant, {
        $push: { messages: message._id }
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch messages for a conversation
const getMessages = async (req, res) => {
    try {
      const { conversationId } = req.params;
  
      const messages = await Message.find({ conversation: conversationId })
        .populate('participants')  
        .populate[{ path: 'sentBy' }]
        .populate({
            path: 'messages',
            populate: [
              { path: 'participants' }
            ]
          })
          .execPopulate();
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  addMessageToConversation,
  createConversation,
  getMessages
};
