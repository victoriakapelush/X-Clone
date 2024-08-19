const User = require("../models/User");

const getFollowers = async (req, res) => {
  const currentUser = req.params.formattedUsername;

  try {
    const followers = await User.findOne({
      formattedUsername: currentUser,
    }).populate("profile.totalFollowers");
    const following = await User.findOne({
      formattedUsername: currentUser,
    }).populate("profile.totalFollowing");

    if (!followers || !following) {
      return res.status(404).json({ message: "User not found" });
    }
    const totalFollowers = followers.profile.totalFollowers;
    const shuffledFollowers = totalFollowers.sort(() => 0.5 - Math.random());

    const totalFollowing = following.profile.totalFollowing;
    const shuffledFollowing = totalFollowing.sort(() => 0.5 - Math.random());

    res
      .status(200)
      .json({
        success: true,
        followers: shuffledFollowers,
        following: shuffledFollowing,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getFollowers };
