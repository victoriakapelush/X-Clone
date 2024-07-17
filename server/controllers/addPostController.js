const User = require('../models/User');
const Post = require('../models/Post');
const { formatDistanceToNow } = require('date-fns');

const getPost = async (req, res) => {
    const currentUser = req.user.id;
    try {
        const user = await User.findById(currentUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Find all posts made by the user
        const posts = await Post.find({ user: currentUser });
    
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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

        const newPost = new Post({
            text,
            image: filename,
            time: formattedTime,
            reply: 0,
            repost: 0,
            like: 0,
            share: 0,
            user: user._id
        });

        await newPost.save();
        user.profile.posts = (user.profile.posts || 0) + 1; 

        await user.save();
        res.status(201).json({ message: 'Post added successfully', post: newPost });
        } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getPost, addPost };