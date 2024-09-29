const mongoose = require("mongoose");
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

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    // Check if a conversation exists with exactly these two participants (userId and selectedUserId)
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, selectedUserId], $size: 2 },
    });

    // Create new message
    const message = new Message({
      participants: [userId, selectedUserId],
      text: text || "", // Optional text
      post: postId, // Attach post to message
      conversation: conversation ? conversation._id : null, // Link to conversation if it exists
      sentBy: userId,
      image: filename,
      gif: gif || "",
      time: formattedTime,
    });

    // Save message
    await message.save();

    if (!conversation) {
      // If no conversation exists, create a new one and add the message
      conversation = new Conversation({
        participants: [userId, selectedUserId],
        messages: [message._id], // Add the new message
      });
      await conversation.save();
    } else {
      // If conversation exists, push the message into the conversation's messages array
      conversation.messages.push(message._id);
      await conversation.save(); // Save the updated conversation
    }

    // Update the User models for all participants to track messages
    for (const participant of conversation.participants) {
      await User.findByIdAndUpdate(participant, {
        $push: { messages: message._id },
      });
    }

    // Respond with the saved message
    res
      .status(201)
      .json({ message: "Post sent via message successfully", data: message });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { sendPost };
