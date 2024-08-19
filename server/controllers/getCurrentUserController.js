const User = require("../models/User");
const Post = require("../models/Post");

const getOtherUserProfile = async (req, res) => {
  const currentUser = req.params.formattedUsername;

  try {
    const user = await User.findOne({ formattedUsername: currentUser });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const posts = await Post.find({ user: user._id });
    res.status(200).json({ success: true, user: user, posts: posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getOtherUserProfile };
