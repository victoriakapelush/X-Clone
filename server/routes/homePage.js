const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  addUserProfile,
  getUserProfile,
  addUserPhoto
} = require("../controllers/addUserProfileController");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getUserProfile);
router.post(
  "/:formattedUsername",
  verifyJWT,
  upload.single("profilePicture"),
  addUserProfile,
);
router.post("/:formattedUsername", verifyJWT, upload.single("profilePicture"), addUserPhoto);

module.exports = router;
