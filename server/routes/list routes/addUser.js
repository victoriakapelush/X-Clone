const express = require("express");
const router = express.Router();
const {
    addUserToList
} = require("../../controllers/list controllers/addUser");
const { verifyJWT } = require("../../controllers/loginController");

router.post("/", verifyJWT, addUserToList);

module.exports = router;