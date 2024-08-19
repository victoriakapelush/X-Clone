const express = require("express");
const {
  saveFollowingCount,
} = require("../controllers/followingCountController");
const router = express.Router();
const { verifyJWT } = require("../controllers/loginController");

router.put("/:formattedUsername", verifyJWT, saveFollowingCount);

module.exports = router;
