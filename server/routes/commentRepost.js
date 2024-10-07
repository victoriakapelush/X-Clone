const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { commentRepost } = require("../controllers/commentRepostController");
const { verifyJWT } = require("../controllers/loginController");

router.post("/:formattedUsername", verifyJWT, upload.single("image"), commentRepost);

module.exports = router;