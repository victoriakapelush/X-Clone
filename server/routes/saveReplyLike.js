const express = require("express");
const {
  saveReplyLikeCount,
} = require("../controllers/likeCountReplyController");
const router = express.Router();
const { verifyJWT } = require("../controllers/loginController");

router.put(
  "/:formattedUsername/saveReplyLike/:replyId",
  verifyJWT,
  saveReplyLikeCount,
);

module.exports = router;
