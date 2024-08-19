const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  addNestedComment,
  getComments,
} = require("../controllers/nestedCommentController");
const { verifyJWT } = require("../controllers/loginController");

router.post(
  "/:formattedUsername/comment/:replyId",
  verifyJWT,
  upload.single("image"),
  addNestedComment,
);
router.get("/:formattedUsername/comment/:replyId", verifyJWT, getComments);

module.exports = router;
