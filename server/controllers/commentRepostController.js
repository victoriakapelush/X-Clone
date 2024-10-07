const Reply = require("../models/Reply");
const Post = require("../models/Post");
const User = require("../models/User");
const { format } = require("date-fns");

const commentRepost = async (req, res) => {
  const currentUserId = req.user.id; 
  const currentUserName = req.user.originalUsername;
  const { commentId } = req.body;

  try {
    const originalReply = await Reply.findById(commentId)
      .populate("user")
      .populate("repostedFrom")
      .populate("originalReplyId")
      .populate({
        path: "totalReplies.user",
        model: "User",
      })
      .populate("bookmarks")
      .populate("likes");

    if (!originalReply) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is trying to repost their own comment
    if (originalReply.user._id.toString() === currentUserId) {
      return res.status(403).json({ message: "You cannot repost your own comment." });
    }

    const loggedInUser = await User.findOne({ originalUsername: currentUserName });
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the logged-in user has already reposted this reply
    const alreadyReposted = await Reply.findOne({
      user: currentUserId,
      originalReplyId: commentId,
    });

    if (alreadyReposted) {
      return res.status(400).json({ message: "You have already reposted this comment." });
    }

    const postDate = new Date();
    const formattedTime = format(postDate, "PPpp");

    // Create the repost in the Reply model
    const repostReply = new Reply({
      text: originalReply.text,
      image: originalReply.image,
      gif: originalReply.gif,
      reply: originalReply.reply,
      totalReplies: originalReply.totalReplies,
      repost: originalReply.repost + 1,
      likeCount: originalReply.likeCount,
      likes: originalReply.likes,
      share: originalReply.share,
      user: currentUserId, 
      tags: originalReply.topTags,
      repostedFrom: originalReply.user,
      originalReplyId: originalReply,
      post: originalReply.post,
      time: formattedTime
    });

    const savedReply = await repostReply.save();

    // Now, create a new entry in the Post model
    const repostedPost = new Post({
      text: originalReply.text,  // Use the text of the original reply
      image: originalReply.image,
      gif: originalReply.gif,
      reply: originalReply.reply,
      repost: originalReply.repost + 1,
      likeCount: originalReply.likeCount,
      likes: originalReply.likes,
      share: originalReply.share,
      user: currentUserId,  // Logged in user reposting the comment
      repostedFrom: originalReply.user,
      originalPostId: originalReply._id,  // Link to the original reply (as the "original post")
      time: formattedTime
    });

    const savedPost = await repostedPost.save();

    // Increment the repost count for the original reply
    originalReply.repost += 1;
    await originalReply.save();

    // Increment the post count for the logged-in user's profile
    loggedInUser.profile.posts = (loggedInUser.profile.posts || 0) + 1;
    await loggedInUser.save();  // Save changes to the logged-in user's profile

    res.status(201).json({
      message: "Comment reposted successfully as a post",
      post: savedPost,  // Return the new post object created
    });
  } catch (error) {
    console.error("Repost Error:", error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

module.exports = { commentRepost };

