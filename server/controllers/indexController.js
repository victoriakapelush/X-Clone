const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signupGet = (req, res) => {
  User.find()
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
      res.json(users);
    })
    .catch((err) => res.status(500).json({ error: "Error fetching users" }));
};

const signupPost = async (req, res) => {
  try {
    const { originalUsername, email, password } = req.body;
    const formattedUsername = originalUsername
      .toLowerCase()
      .replace(/\s+/g, "");
    if (!password) {
      console.log("Password is not provided.");
      return res
        .status(400)
        .json({ message: "Invalid password format. Password is required." });
    }
    if (typeof password !== "string") {
      console.log("Password is not a string.");
      return res
        .status(400)
        .json({
          message: "Invalid password format. Password must be a string.",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

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

    // Create a new user
    const user = new User({
      originalUsername,
      formattedUsername,
      email,
      password: hashedPassword,
    });

    // Create a new profile for the user
    user.profile = {
      profileBio: "",
      profilePicture: null,
      updatedName: originalUsername,
      location: "",
      website: "",
      registrationDate: "Joined " + currentMonthYear,
      following: "",
      followers: "",
      posts: 0,
    };

    await user.save();

    const payload = {
      id: user._id,
      originalUsername: user.originalUsername,
      formattedUsername: user.formattedUsername,
    };

    jwt.sign(payload, "cats", { expiresIn: 86400 }, (err, token) => {
      if (err || !token) {
        console.error(err);
        return res.status(500).json({ message: "Error generating token" });
      }
      res
        .status(201)
        .json({ success: true, message: "Registration successful", token });
      console.log(token);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signupGet, signupPost };
