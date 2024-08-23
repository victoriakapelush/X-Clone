const Post = require("../models/Post");
const User = require("../models/User");
const { format } = require("date-fns");

const repost = async (req, res) => {
    const currentUserId = req.user.id;
    const currentUserName = req.user.originalUsername;
    const { postId } = req.body;

    try {
      const originalPost = await Post.findById(postId)
        .populate('user') 
        .populate('repostedFrom') 
        .populate('originalPostId') 
        .populate({
            path: 'totalReplies.user', 
            model: 'User' 
        })
        .populate('bookmarks') 
        .populate('likes');

      if (!originalPost) {
          return res.status(404).json({ message: "Post not found" });
        }
        const user = await User.findOne({ originalUsername: currentUserName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const repost = new Post({
            text: originalPost.text,
            image: originalPost.image,
            gif: originalPost.gif,
            time: originalPost.time,
            reply: originalPost.reply,
            totalReplies: originalPost.totalReplies,
            repost: 0,
            likeCount: originalPost.likeCount,
            likes: originalPost.likes,
            share: originalPost.share,
            user: currentUserId,
            tags: originalPost.topTags,
            repostedFrom: originalPost.user,
            originalPostId: originalPost
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
            post: savedPost
        });
    } catch (error) {
        console.error("Repost Error:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
      
      module.exports = { repost };