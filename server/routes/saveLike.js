const express = require('express');
const { saveLikeCount } = require('../controllers/likeCountController');
const router = express.Router();

router.post('/', saveLikeCount);

module.exports = router;
