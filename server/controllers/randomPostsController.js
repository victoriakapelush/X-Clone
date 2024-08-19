const User = require("../models/User");
const Post = require("../models/Post");

const getRandomPosts = async (req, res) => {
  const currentUser = req.user.id;

  try {
    const posts = await Post.find({ user: { $ne: currentUser } }).populate(
      "user",
    );

    // Shuffle the posts array
    const shuffledPosts = posts.sort(() => Math.random() - 0.5);

    // Optionally limit the number of posts returned
    const limit = parseInt(req.query.limit, 10) || 20;
    const randomPosts = shuffledPosts.slice(0, limit);

    res.status(200).json({ posts: randomPosts });
  } catch (error) {
    console.error("Error fetching random posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getRandomPosts };
