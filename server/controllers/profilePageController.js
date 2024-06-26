const User = require('../models/User');

const getProfilePage = async (req, res) => {
    try {
        const { formattedUsername } = req.params;
        const userId = req.user.id;
        const user = await User.findOne({ _id: userId, formattedUsername });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found '})
        } 
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateProfilePage = async (req, res) => {
    const { formattedUsername } = req.params;
    const userId = req.user.id;
    const { originalUsername, profileBio, location, website } = req.body;
    
    try {
        const user = await User.findOne({ _id: userId, formattedUsername });

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (req.files['profilePicture']) {
            user.profile.profilePicture = req.files['profilePicture'][0].path;
        } else {
            user.profile.profilePicture = null;
        }

        if (req.files['backgroundHeaderImage']) {
            user.profile.backgroundHeaderImage = req.files['backgroundHeaderImage'][0].path;
        } else {
            user.profile.backgroundHeaderImage = null;
        }

        user.originalUsername = originalUsername;
        user.profile.profileBio = profileBio;
        user.profile.location = location;
        user.profile.website = website;

        await user.save();
        res.status(200).send('Profile updated successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
}

module.exports = { getProfilePage, updateProfilePage };