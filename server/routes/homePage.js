const express = require("express");
const router = express.Router();
const {
  addUserProfile,
  getUserProfile,
} = require("../controllers/addUserProfileController");
const { verifyJWT } = require("../controllers/loginController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/:formattedUsername", verifyJWT, getUserProfile);
router.post(
  "/:formattedUsername",
  verifyJWT,
  upload.single("profilePicture"),
  addUserProfile,
);

module.exports = router;
