const express = require("express");
const router = express.Router();
const { getSingleUserProfile } = require("../controllers/singleUserController");

router.get("/:formattedUsername", getSingleUserProfile);

module.exports = router;
