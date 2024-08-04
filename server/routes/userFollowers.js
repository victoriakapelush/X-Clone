const express = require('express');
const router = express.Router();
const { getUserFollowers } = require('../controllers/getFollowersController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getUserFollowers);

module.exports = router;