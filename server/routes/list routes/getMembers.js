const express = require("express");
const router = express.Router();
const {
    getListData
} = require("../../controllers/list controllers/getListData");
const { verifyJWT } = require("../../controllers/loginController");

router.get("/:listId", verifyJWT, getListData);

module.exports = router;