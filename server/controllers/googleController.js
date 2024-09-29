require("dotenv").config({ path: "./config.env" });
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.clientID);
const JWT_SECRET = process.env.JWT_SECRET;

const googleAuth = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;
    const formattedName = name.toLowerCase().replace(/\s+/g, "");

    // Get the current month and year
    const now = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    // Check if user exists, if not create a new one
    let user = await User.findOne({ googleId: googleId });
    if (!user) {
      user = await User.create({
        googleId: googleId,
        originalUsername: name,
        formattedUsername: formattedName,
        email: email,
        profile: {
          profileBio: "",
          profilePicture: picture,
          backgroundHeaderImage: null,
          updatedName: name,
          location: "",
          website: "",
          registrationDate: "Joined " + currentMonthYear,
          following: "",
          totalFollowing: [],
          followers: "",
          totalFollowers: [],
          posts: 0,
        },
      });
    }
    // Create a token (JWT or session) and return it
    const token = jwt.sign(
      {
        id: user._id,
        originalUsername: user.originalUsername,
        formattedUsername: user.formattedUsername,
      },
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    // Send the token to the client
    res
      .status(201)
      .json({
        success: true,
        message: "Registration successful",
        token: token,
        user: user,
      });
  } catch (error) {
    console.error("Error verifying Google ID token", error);
    res.status(400).json({ success: false, message: "Invalid token" });
  }
};

module.exports = {
  googleAuth,
};
