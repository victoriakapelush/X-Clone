const express = require('express');
const router = express.Router();
const { getConversations } = require('../../controllers/message controllers/getAllConversations');
const { verifyJWT } = require("../../controllers/loginController");

router.get('/:formattedUsername', verifyJWT, getConversations);

module.exports = router;