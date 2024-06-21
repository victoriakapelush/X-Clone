const User = require('../models/User');

const addUserProfile = async (req, res) => {
    const { profileBio } = req.body;
    try {
        let imagePath;
        if (req.file) {
            imagePath = req.file.filename;
        }
        const currentUser = req.user.originalUsername; 

        const updateFields = {
            profilePicture: imagePath,
            profileBio: profileBio
        };

        const updatedUser = await User.findOneAndUpdate(
            { originalUsername: currentUser }, 
            updateFields, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
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