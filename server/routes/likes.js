const express = require('express');
const router = express.Router();
const { getAllLikes } = require('../controllers/likesController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getAllLikes);

module.exports = router;