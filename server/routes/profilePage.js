const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  addUserProfile,
  getUserProfile,
} = require("../controllers/addUserProfileController");
const { verifyJWT } = require("../controllers/loginController");
const {
  deleteProfilePicture,
} = require("../controllers/profilePageController");

router.get("/:formattedUsername", verifyJWT, getUserProfile);
router.post(
  "/:formattedUsername",
  verifyJWT,
  upload.fields([
    { name: "profilePicture" },
    { name: "backgroundHeaderImage" },
  ]),
  addUserProfile,
);
router.delete(
  "/:formattedUsername/delete-profile-picture",
  verifyJWT,
  deleteProfilePicture,
);

module.exports = router;
