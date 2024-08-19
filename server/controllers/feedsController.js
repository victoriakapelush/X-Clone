const Post = require("../models/Post");
const User = require("../models/User");

const getPostsFromFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "profile.totalFollowing",
      "_id",
    );
    const followedUserIds = user.profile.totalFollowing.map(
      (followedUser) => followedUser._id,
    );
    const posts = await Post.aggregate([
      { $match: { user: { $in: followedUserIds } } },
      { $sample: { size: 10 } },
    ]);
    const postIds = posts.map((post) => post._id);
    const populatedPosts = await Post.find({ _id: { $in: postIds } }).populate(
      "user",
    );
    res.status(200).json(populatedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPostsFromFollowing };
