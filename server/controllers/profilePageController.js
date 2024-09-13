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

// Check for profile picture update or deletion
if (req.files && req.files.profilePicture) {
  // If a new profile picture is uploaded
  user.profile.profilePicture = req.files.profilePicture[0].filename;
} else if (req.body.deleteProfilePicture === 'true') {
  // If the profile picture is to be deleted
  user.profile.profilePicture = null;
}

// Check for background image update or deletion
if (req.files && req.files.backgroundHeaderImage) {
  // If a new background image is uploaded
  user.profile.backgroundHeaderImage = req.files.backgroundHeaderImage[0].filename;
} else if (req.body.deleteBackgroundHeaderImage === 'true') {
  // If the background image is to be deleted
  user.profile.backgroundHeaderImage = null;
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

const deleteProfilePicture = async (req, res) => {
  const userId = req.user.id;
  const deleteProfilePicture = req.query.deleteProfilePicture === 'true';
  const deleteBackgroundImage = req.query.deleteBackgroundImage === 'true';
  
  try {
    const user = await User.findOne({
      _id: userId
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

// Check and delete profile picture if requested
if (deleteProfilePicture && user.profile.profilePicture) {
  user.profile.profilePicture = null; // Remove the profile picture
}

// Check and delete background header image if requested
if (deleteBackgroundImage && user.profile.backgroundHeaderImage) {
  user.profile.backgroundHeaderImage = null; // Remove the background header image
}

await user.save(); // Save changes to MongoDB

    res.status(200).send("Profile picture deleted from MongoDB successfully");
  } catch (error) {
    console.error("Error deleting profile picture", error);
    res.status(500).send("Server error");
  }
};

module.exports = { getProfilePage, updateProfilePage, deleteProfilePicture };