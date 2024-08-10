const User = require('../models/User');
const Reply = require('../models/Reply');

const getRepliesByUser = async (req, res) => {
    const { formattedUsername } = req.params;

    try {
        const user = await User.findOne({ formattedUsername });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const replies = await Reply.find({ user: user._id })
        .populate('post') 
        .populate('user') 
        .populate({
            path: 'post',
            populate: [
                {
                    path: 'user', 
                    model: 'User',
                },
                {
                    path: 'totalReplies', 
                    populate: [
                        { path: 'user', model: 'User' }, 
                        { path: 'post', model: 'Post' }, 
                    ],
                },
            ],
        })
        .populate({
            path: 'totalReplies', 
            populate: [
                {
                    path: 'user', 
                    model: 'User',
                },
                {
                    path: 'post',
                    model: 'Post',
                },
                {
                    path: 'totalReplies', 
                    populate: {
                        path: 'user', 
                        model: 'User',
                    },
                },
            ],
        })
        .sort({ time: -1 }); // Sort by time in descending order
    
        res.status(200).json({ replies });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getRepliesByUser };