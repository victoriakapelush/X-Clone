const express = require('express');
const router = express.Router();
const { getAllMedia } = require('../controllers/mediaController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getAllMedia);

module.exports = router;