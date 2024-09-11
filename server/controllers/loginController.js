require("dotenv").config({ path: "./config.env" });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    const { originalUsername, email, password } = req.body;
    const formattedUsername = originalUsername
      .toLowerCase()
      .replace(/\s+/g, "");
    const user = await User.findOne({
      $or: [
        { originalUsername: originalUsername, email: email },
        { formattedUsername: formattedUsername, email: email },
      ],
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const payload = {
      id: user._id,
      originalUsername: user.originalUsername,
      formattedUsername: user.formattedUsername,
    };
    jwt.sign(payload, "cats", { expiresIn: "3d" }, (err, token) => {
      if (err || !token) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.json({ message: "Login successful", token: token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function verifyJWT(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "Authorization token is missing", isLoggedIn: false });
  }

  const tokenParts = authorizationHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization header format",
      isLoggedIn: false,
    });
  }

  const token = tokenParts[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "Failed to Authenticate" });
    }
    req.user = {
      id: decoded.id,
      originalUsername: decoded.originalUsername,
      formattedUsername: decoded.formattedUsername,
    };
    next();
  });
}

module.exports = { login, verifyJWT };
