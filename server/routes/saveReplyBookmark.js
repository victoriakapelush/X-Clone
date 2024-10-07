const express = require("express");
const {
  bookmarkReply,
} = require("../controllers/bookmarkReply");
const router = express.Router();
const { verifyJWT } = require("../controllers/loginController");

router.put(
  "/:formattedUsername/saveReplyBookmark/:replyId",
  verifyJWT,
  bookmarkReply,
);

module.exports = router;