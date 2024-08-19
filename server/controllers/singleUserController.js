const User = require("../models/User");

const getSingleUserProfile = async (req, res) => {
  const { formattedUsername } = req.params;

  try {
    const singleUserProfile = await User.findOne({ formattedUsername });
    if (!singleUserProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, singleUserProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSingleUserProfile };
