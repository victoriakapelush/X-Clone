const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const { addUserProfile } = require('../controllers/addUserProfileController');

router.post('/:username', upload.single("profilePicture"), addUserProfile);

module.exports = router;