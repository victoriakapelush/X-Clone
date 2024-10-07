const express = require("express");
const router = express.Router();
const {
    getCommonFollowers
} = require("../controllers/getCommonFollowers");
const { verifyJWT } = require("../controllers/loginController");

router.get("/:formattedUsername", verifyJWT, getCommonFollowers);

module.exports = router;