const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
    sendPost
} = require("../controllers/sendPost");
const { verifyJWT } = require("../controllers/loginController");

router.post("/:formattedUsername", verifyJWT, upload.single("image"), sendPost);

module.exports = router;