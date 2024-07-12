const User = require('../models/User'); 

const getRandomPosts = async (req, res) => {
    const currentUser = req.user.originalUsername; 

    try {
        // Fetch all users except the logged-in user
        const users = await User.find({ originalUsername: { $ne: currentUser } }, 'post'); // Exclude logged-in user's posts

        // Aggregate all posts from all other users
        let allPosts = [];
        users.forEach(user => {
            allPosts = allPosts.concat(user.post);
        });

        // Shuffle the posts array
        allPosts = allPosts.sort(() => Math.random() - 0.5);

        // Optionally limit the number of posts returned
        const limit = parseInt(req.query.limit) || 20;
        const randomPosts = allPosts.slice(0, limit);

        res.status(200).json({ posts: randomPosts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getRandomPosts };

