const Post = require('../models/Post');

const getAllLikes = async (req, res) => {
  const currentUserId = req.user.id;  

  try {
    const likedPosts = await Post.find({
        likes: currentUserId
      }).populate('user');
  
      res.status(200).json({ success: true, likedPosts: likedPosts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = { getAllLikes };