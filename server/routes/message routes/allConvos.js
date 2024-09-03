const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { addMessageToConversation, createConversation, getMessages } = require('../../controllers/message controllers/dialogueController');
const { verifyJWT } = require("../../controllers/loginController");

// Route to send a message
router.post('/send', verifyJWT, upload.single("image"), createConversation);
router.put('/:conversationId', verifyJWT, upload.single("image"), addMessageToConversation)
// Route to get messages for a conversation
router.get('/:conversationId', verifyJWT, getMessages);

module.exports = router;
