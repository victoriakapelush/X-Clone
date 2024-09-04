const mongoose = require("mongoose");
const Reply = require("../models/Reply");

const saveReplyLikeCount = async (req, res) => {
  const { _id, post } = req.body;
  const currentUser = req.user.id;

  // Validate that _id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({ message: "Invalid reply ID" });
  }

  // Validate that post is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(post)) {
    return res.status(400).send({ message: "Invalid post ID" });
  }

  try {
    const reply = await Reply.findById(_id);

    if (!reply) {
      return res.status(404).send({ message: "Reply not found" });
    }

    // Ensure the reply has the post ID
    if (!reply.post) {
      reply.post = post;
    }

    if (typeof reply.likeCount !== "number") {
      reply.likeCount = 0;
    }

    const userIndex = reply.likes.indexOf(currentUser);

    if (userIndex === -1) {
      // User has not liked the reply yet, so add their ID to the likes array and increment likeCount
      reply.likes.push(currentUser);
      reply.likeCount += 1;
    } else {
      // User already liked the reply, so remove their ID from the likes array and decrement likeCount
      reply.likes.splice(userIndex, 1);
      reply.likeCount = Math.max(reply.likeCount - 1, 0); // Ensure likeCount does not go below 0
    }

    const updatedReply = await reply.save();

    res.status(200).send({
      message: "Like status updated successfully",
      reply: updatedReply,
    });
  } catch (error) {
    console.error("Error saving like count for reply:", error);
    res.status(500).send({
      message: "Error saving like count for reply",
      error: error.message,
    });
  }
};

module.exports = { saveReplyLikeCount };
