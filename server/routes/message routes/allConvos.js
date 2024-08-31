const express = require('express');
const router = express.Router();
const { addMessageToConversation, createConversation, getMessages } = require('../../controllers/message controllers/dialogueController');
const { verifyJWT } = require("../../controllers/loginController");

// Route to send a message
router.post('/send', verifyJWT, createConversation);
router.put('/:conversationId', verifyJWT, addMessageToConversation)
// Route to get messages for a conversation
router.get('/:conversationId', verifyJWT, getMessages);

module.exports = router;
