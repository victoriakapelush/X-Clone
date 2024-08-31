const User = require("../models/User");

const getProfilePage = async (req, res) => {
  const currentUser = req.params.formattedUsername;
  console.log(currentUser);

  try {
    const user = await User.findOne({ formattedUsername: currentUser });
    if (!user) {
      return res.status(404).json({ message: "User profile not found " });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfilePage = async (req, res) => {
  const currentUser = req.params.formattedUsername;
  const userId = req.user.id;
  const { updatedName, profileBio, location, website } = req.body;

  try {
    const user = await User.findOne({
      _id: userId,
      formattedUsername: currentUser,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.profile.updatedName = updatedName;
    user.profile.profileBio = profileBio;
    user.profile.location = location;
    user.profile.website = website;

    await user.save();
    res.status(200).send("Profile updated successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = { getProfilePage, updateProfilePage };
