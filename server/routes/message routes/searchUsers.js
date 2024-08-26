const express = require('express');
const router = express.Router();
const { searchUsers } = require('../../controllers/message controllers/UserSearchController');
const { verifyJWT } = require("../../controllers/loginController");

router.get('/search', verifyJWT, searchUsers);

module.exports = router;
