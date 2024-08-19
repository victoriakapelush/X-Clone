const express = require("express");
const router = express.Router();
const {
  getBookmark,
  addBookmark,
} = require("../controllers/bookmarkController");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getBookmark);
router.put("/:formattedUsername", verifyJWT, addBookmark);

module.exports = router;
