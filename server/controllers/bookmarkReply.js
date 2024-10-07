const mongoose = require("mongoose");
const Reply = require("../models/Reply");
const User = require("../models/User");

const bookmarkReply = async (req, res) => {
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
    const user = await User.findById(currentUser);

    if (!reply) {
      return res.status(404).send({ message: "Reply not found" });
    }

    // Ensure the reply has the post ID
    if (!reply.post) {
      reply.post = post;
    }

    const userIndex = reply.bookmarks.indexOf(currentUser);
    const userBookmarkIndex = user.bookmarkedComments.indexOf(reply._id);

    if (userIndex === -1) {
      // User has not bookmarked the reply yet, so add their ID to the array
      reply.bookmarks.push(currentUser);
      user.bookmarkedComments.push(reply._id);
    } else {
      // User already bookmarked the reply, so remove their ID from the array
      reply.bookmarks.splice(userIndex, 1);
      user.bookmarkedComments.splice(userBookmarkIndex, 1);
    }

    const updatedReply = await reply.save();
    await user.save();

    res.status(200).send({
      message: "Bookmark status updated successfully",
      reply: updatedReply,
    });
  } catch (error) {
    console.error("Error saving bookmark:", error);
  }
};

module.exports = { bookmarkReply };