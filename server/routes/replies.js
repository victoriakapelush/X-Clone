const express = require("express");
const router = express.Router();
const { getRepliesByUser } = require("../controllers/getAllRepliesController");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getRepliesByUser);

module.exports = router;
