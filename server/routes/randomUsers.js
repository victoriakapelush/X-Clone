const express = require("express");
const router = express.Router();
const {
  addUserProfile,
  getUserProfile,
} = require("../controllers/addUserProfileController");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getUserProfile);
router.post("/:formattedUsername", verifyJWT, addUserProfile);

module.exports = router;
