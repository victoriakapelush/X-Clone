const User = require('../models/User');
const Profile = require('../models/Profile');

const addUserProfile = async (req, res) => {
    const { profileBio, location, website } = req.body;
    const currentUser = req.user.originalUsername;
    try {
        let imagePath;
        if (req.file) {
            imagePath = req.file.filename;
        }
        if (!req.file) {
            imagePath = null;
        }
        const user = await User.findOne({ originalUsername: currentUser }).populate('profile');

        if (!user || !user.profile) {
            return res.status(404).send('User or user profile not found');
        }

        // Update the user's profile subdocument
        user.profile.profilePicture = imagePath;
        user.profile.profileBio = profileBio || '';
        user.profile.location = location || '';
        user.profile.website = website || '';

        await user.save();

        res.status(200).send('User profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};



const getUserProfile = async (req, res) => {
    const currentUser = req.user.originalUsername;
    try {
        const userProfile = await User.findOne({ originalUsername: currentUser });
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userProfile);    
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { addUserProfile, getUserProfile };