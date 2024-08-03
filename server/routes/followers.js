const express = require('express');
const router = express.Router();
const { getFollowers } = require('../controllers/getFollowersController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getFollowers);

module.exports = router;