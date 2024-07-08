const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const { addUserProfile, getUserProfile } = require('../controllers/addUserProfileController');
const { verifyJWT } = require('../controllers/loginController');
const { getRandomUsers } = require('../controllers/randomUsersController');

router.get('/:formattedUsername', verifyJWT, getUserProfile, getRandomUsers);
router.post('/:formattedUsername', verifyJWT, upload.single("profilePicture"), addUserProfile);

module.exports = router;