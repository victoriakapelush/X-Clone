const express = require('express');
const router = express.Router();
const { authenticateGoogle, handleGoogleCallback } = require('../controllers/googleController');

// Route to initiate Google authentication
router.get('/', authenticateGoogle);

// Route to handle Google callback
router.get('/callback', handleGoogleCallback);

module.exports = router;

