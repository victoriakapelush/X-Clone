const User = require("../models/User");
const Post = require("../models/Post");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { format } = require("date-fns");

const sendPost = async (req, res) => {
  try {
    const { postId, selectedUserId, text, gif } = req.body;
    const userId = req.user.id;

    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    const postDate = new Date();
    const formattedTime = format(postDate, "PPpp");

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if a conversation exists with exactly these two participants (userId and selectedUserId)
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, selectedUserId], $size: 2 },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, selectedUserId],
      });
      await conversation.save();
    }

    // Create new message
    const message = new Message({
      participants: conversation.participants,
      text: text || '', // Optional text
      post: postId, // Attach post to message
      conversation: conversation._id,
      sentBy: userId,
      image: filename,
      gif: gif || '',
      time: formattedTime,
    });

    // Save message
    await message.save();

    // Update the User models for all participants
    for (const participant of conversation.participants) {
      await User.findByIdAndUpdate(participant, {
        $push: { messages: message._id },
      });
    }

    // Respond with the saved message
    res.status(201).json({ message: "Post sent via message successfully", data: message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { sendPost };
