const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const { addCommentToPost, getComments } = require('../controllers/addCommentController');
const { verifyJWT } = require('../controllers/loginController');

router.post('/:formattedUsername/comment/:postId', verifyJWT, upload.single('image'), addCommentToPost);
router.get('/:formattedUsername/comment/:postId', verifyJWT, getComments);

module.exports = router;
