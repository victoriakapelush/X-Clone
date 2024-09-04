const Post = require("../models/Post");
const User = require("../models/User");

const repost = async (req, res) => {
  const currentUserId = req.user.id;
  const currentUserName = req.user.originalUsername;
  const { postId } = req.body;

  try {
    const originalPost = await Post.findById(postId)
      .populate("user")
      .populate("repostedFrom")
      .populate("originalPostId")
      .populate({
        path: "totalReplies.user",
        model: "User",
      })
      .populate("bookmarks")
      .populate("likes");

    if (!originalPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is trying to repost their own post
    if (originalPost.user._id.toString() === currentUserId) {
      return res
        .status(403)
        .json({ message: "You cannot repost your own post." });
    }

    const user = await User.findOne({ originalUsername: currentUserName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has already reposted this post
    const alreadyReposted = await Post.findOne({
      user: currentUserId,
      originalPostId: postId,
    });

    if (alreadyReposted) {
      return res
        .status(400)
        .json({ message: "You have already reposted this post." });
    }

    // Create the repost
    const repost = new Post({
      text: originalPost.text,
      image: originalPost.image,
      gif: originalPost.gif,
      time: originalPost.time,
      reply: originalPost.reply,
      totalReplies: originalPost.totalReplies,
      repost: originalPost.repost + 1,
      likeCount: originalPost.likeCount,
      likes: originalPost.likes,
      share: originalPost.share,
      user: currentUserId,
      tags: originalPost.topTags,
      repostedFrom: originalPost.user,
      originalPostId: originalPost,
    });

    const savedPost = await repost.save();

    // Increment the repost count for the original post
    originalPost.repost += 1;
    await originalPost.save();

    // Increment the post count in the user's profile
    user.profile.posts = (user.profile.posts || 0) + 1;
    await user.save();

    res.status(201).json({
      message: "Post reposted successfully",
      post: savedPost,
    });
  } catch (error) {
    console.error("Repost Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = { repost };
