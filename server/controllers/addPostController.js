const User = require('../models/User');
const format = require('date-fns/format');
const { formatDistanceToNow } = require('date-fns');

const getPost = async (req, res) => {
    const currentUser = req.user.originalUsername;
    try {
        const post = await User.findOne({ originalUsername: currentUser });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);    
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addPost = async (req, res) => {
    const { text } = req.body;
    const currentUser = req.user.originalUsername;

    try {
        let filename = null;
        if (req.file) {
            filename = req.file.filename;
        }

        const user = await User.findOne({ originalUsername: currentUser });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postTime = new Date();
        const formattedTime = formatDistanceToNow(postTime, { addSuffix: true , includeSeconds: true });

        const newPost = ({
            text,
            image: filename,
            time: formattedTime,
            reply: 0,
            repost: 0,
            like: 0,
            share: 0,
            updatedName: user.profile.updatedName || user.originalUsername,
            formattedUsername: user.formattedUsername,
            profilePicture: user.profile.profilePicture
        });

        user.post.push(newPost);
        user.profile.posts = (user.profile.posts || 0) + 1; 

        await user.save();
        res.status(201).json({ message: 'Post added successfully', post: newPost });
        } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getPost, addPost };