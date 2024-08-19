const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { getPost, addPost } = require("../controllers/addPostController");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getPost);
router.post("/:formattedUsername", verifyJWT, upload.single("image"), addPost);

module.exports = router;
