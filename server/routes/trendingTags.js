const express = require('express');
const router = express.Router();
const { getTrendingTags } = require('../controllers/getTrendingTagsController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getTrendingTags);

module.exports = router;
