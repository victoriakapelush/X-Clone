const express = require('express');
const router = express.Router();
const { getRandomPosts } = require('../controllers/randomPostsController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getRandomPosts);

module.exports = router;