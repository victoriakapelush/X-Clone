const express = require('express');
const { saveLikeCount } = require('../controllers/likeCountController');
const router = express.Router();
const { verifyJWT } = require('../controllers/loginController');

router.put('/', verifyJWT, saveLikeCount);

module.exports = router;
