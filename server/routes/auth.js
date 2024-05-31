const express = require('express');
const passport = require('../config-passport');
const router = express.Router();

router.post('/', passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/' }));

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'consent'})
);

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/home',
    failureRedirect: '/'
})
);

module.exports = router;