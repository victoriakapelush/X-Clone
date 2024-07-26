const express = require('express');
const router = express.Router();
const { getPostsFromFollowing } = require('../controllers/feedsController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getPostsFromFollowing);

module.exports = router;