const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.clientID);

const googleAuth = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.clientID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        username: payload.name,
        email: payload.email,
      });
    }

    // Generate a JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token: jwtToken });
  } catch (error) {
    console.error('Error verifying Google ID token', error);
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = {
  googleAuth,
};
