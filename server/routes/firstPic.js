const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  addUserPhoto
} = require("../controllers/addUserProfileController");
const { verifyJWT } = require("../controllers/loginController");

router.post("/:formattedUsername", verifyJWT, upload.single("profilePicture"), addUserPhoto);

module.exports = router;