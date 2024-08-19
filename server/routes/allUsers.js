const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/getAllUsers");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getAllUsers);

module.exports = router;
