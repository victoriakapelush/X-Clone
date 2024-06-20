const User = require('../models/User');

const addUserProfile = async(req, res) => {
    const { profileBio } = req.body;
    try {
        let imagePath;
        if (req.file) {
            imagePath = req.file.filename;
        }
        const newUser = new User({
            profilePicture: imagePath,
            profileBio
        });
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { addUserProfile };