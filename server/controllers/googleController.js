const passport = require('passport');

// Function to handle Google authentication
const authenticateGoogle = passport.authenticate('google', { scope: ['email', 'profile'] });

// Function to handle Google callback
const handleGoogleCallback = passport.authenticate('google', { failureRedirect: '/' }, (req, res) => {
    res.redirect('/home');
});

module.exports = { authenticateGoogle, handleGoogleCallback };
