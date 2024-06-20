const express = require('express');
const passport = require('../config-passport');
const router = express.Router();

router.post('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'consent'})
);

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    const user = req.user;
    if (user && user.formattedUsername) {
      res.redirect(`http://localhost:3000/${user.formattedUsername}`);
    } else {
      res.redirect('/login');
    }
});

module.exports = router;