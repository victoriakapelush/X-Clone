const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const users = await User.find({ _id: { $ne: currentUserId } });
    // Shuffle the array to ensure randomness
    const shuffledUsers = users.sort(() => 0.5 - Math.random());

    // Return the three random users
    res.status(200).json({ success: true, users: shuffledUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUsers };
