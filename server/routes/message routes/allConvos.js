const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../../controllers/message controllers/dialogueController');
const { verifyJWT } = require("../../controllers/loginController");

// Route to send a message
router.post('/send', verifyJWT, sendMessage);

// Route to get messages for a conversation
router.get('/:conversationId', verifyJWT, getMessages);

module.exports = router;
