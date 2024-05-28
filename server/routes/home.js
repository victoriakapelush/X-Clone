const express = require('express');
const router = express.Router();
const { homeGet } = require('../controllers/homeController');

router.get('/', homeGet);

module.exports = router;