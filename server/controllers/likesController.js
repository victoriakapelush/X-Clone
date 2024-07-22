const Post = require('../models/Post');
const User = require('../models/User');

const getAllLikes = async (req, res) => {
  const currentUserId = req.user.id;
  const username = req.params.formattedUsername;
  
  try {

    const user = await User.findOne({ formattedUsername: username });
    if (!user) {
        return res.status(404).send('User not found');
    }

    const likedPosts = await Post.find({
        likes: user
      }).populate('user');
  
      res.status(200).json({ success: true, likedPosts: likedPosts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = { getAllLikes };