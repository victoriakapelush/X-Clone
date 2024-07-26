const Post = require('../models/Post');
const User = require('../models/User');

const getPostsFromFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('profile.totalFollowing', '_id');
        const followedUserIds = user.profile.totalFollowing.map(followedUser => followedUser._id);
        const posts = await Post.aggregate([
            { $match: { user: { $in: followedUserIds } } },
            { $sample: { size: 10 } }
        ]);
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getPostsFromFollowing };