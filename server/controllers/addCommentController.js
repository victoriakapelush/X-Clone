const { format } = require("date-fns");
const User = require("../models/User");
const Post = require("../models/Post");
const Reply = require("../models/Reply");

const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("user")
      .populate("repostedFrom")
      .populate({
        path: "totalReplies",
        populate: {
          path: "user",
          model: "User",
        },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addCommentToPost = async (req, res) => {
  const { text, gif } = req.body;
  const postId = req.params.postId;
  const currentUser = req.user.originalUsername;

  try {
    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    const user = await User.findOne({ originalUsername: currentUser });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const commentDate = new Date();
    const formattedTime = format(commentDate, "PPpp");

    const newReply = new Reply({
      text,
      image: filename,
      gif,
      time: formattedTime,
      reply: 0,
      totalReplies: [],
      repost: 0,
      likeCount: 0,
      likes: [],
      share: 0,
      user: user._id,
      post: postId,
    });

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (typeof post.reply !== "number") {
      post.reply = 0;
    }

    post.totalReplies.push(newReply);
    post.reply = (post.reply || 0) + 1;
    await post.save();
    await newReply.save();

    const populatedReply = await Reply.findById(newReply._id)
      .populate("user")
      .populate("post")
      .populate({
        path: "totalReplies",
        populate: {
          path: "reply",
          model: "Reply",
        },
      });

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: populatedReply });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getComments, addCommentToPost };
