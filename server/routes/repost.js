const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { repost } = require("../controllers/repostController");
const { verifyJWT } = require("../controllers/loginController");

router.post("/:formattedUsername", verifyJWT, upload.single("image"), repost);

module.exports = router;