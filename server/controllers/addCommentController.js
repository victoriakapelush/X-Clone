const { format } = require("date-fns");
const User = require("../models/User");
const Post = require("../models/Post");
const Reply = require("../models/Reply");

// Get comments for the page with one post with comments

const getComments = async (req, res) => {
  const { postId: postIdFromBody } = req.body;
  const postIdFromParams = req.params.postId; 

  const postId = postIdFromParams || postIdFromBody;

  console.log(postId);

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

    post.totalReplies.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add comments to the post

const addCommentToPost = async (req, res) => {
  const { text, gif, postId: postIdFromBody } = req.body;
  const postIdFromParams = req.params.postId; 
  const currentUser = req.user.originalUsername;

  const postId = postIdFromParams || postIdFromBody;

  try {
    let filename = null;
    if (req.file) {
      filename = req.file.filename;
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
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
      originalPostId: postId
    });

    await newReply.save();

    post.totalReplies.push(newReply._id); 
    post.reply = (post.reply || 0) + 1; 
    await post.save();

    // Check if the post is a repost
    let originalPost;
    if (post.originalPostId) {
      originalPost = await Post.findById(post.originalPostId._id);
    }

    // If the post is a repost, update the reply count on the original post
    if (originalPost) {
      originalPost.reply = (originalPost.reply || 0) + 1;
      originalPost.totalReplies.push(newReply._id);
      await originalPost.save();
    }

    // Update replies on all reposted versions of the post
    const reposts = await Post.find({ originalPostId: postId });
    for (let repost of reposts) {
      repost.totalReplies.push(newReply._id); // Add the new reply
      repost.reply = (repost.reply || 0) + 1; // Increment the reply count
      await repost.save(); // Save the repost
    }

    // Also update reposted versions of the original post, if this is a repost
    if (originalPost) {
      const originalReposts = await Post.find({
        originalPostId: originalPost._id,
      });
      for (let repost of originalReposts) {
        repost.totalReplies.push(newReply._id);
        repost.reply = (repost.reply || 0) + 1;
        await repost.save();
      }
    }

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newReply });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { getComments, addCommentToPost };
