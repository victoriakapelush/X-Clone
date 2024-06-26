const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const { getProfilePage, updateProfilePage } = require('../controllers/profilePageController');
const { verifyJWT } = require('../controllers/loginController');

router.get('/:formattedUsername', verifyJWT, getProfilePage);
router.post('/:formattedUsername', verifyJWT, upload.fields([{ name: 'profilePicture' }, { name: 'backgroundHeaderImage' }]), updateProfilePage);

module.exports = router;