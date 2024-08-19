const express = require("express");
const router = express.Router();
const {
  getOtherUserProfile,
} = require("../controllers/otherUserProfileController");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getOtherUserProfile);

module.exports = router;
