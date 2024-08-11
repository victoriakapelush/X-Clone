const User = require('../models/User');
const Reply = require('../models/Reply');
const Post = require('../models/Post');

const getRepliesByUser = async (req, res) => {
    const { formattedUsername } = req.params;

    try {
        const user = await User.findOne({ formattedUsername });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'replies', // Name of the Reply collection
                    localField: 'totalReplies',
                    foreignField: '_id',
                    as: 'replies',
                },
            },
            {
                $unwind: {
                    path: '$replies',
                    preserveNullAndEmptyArrays: true, // Keep posts with no replies
                },
            },
            {
                $match: {
                    'replies.user': user._id, // Match replies with the specified user ID
                },
            },
            {
                $lookup: {
                    from: 'users', // Populate the user who replied
                    localField: 'replies.user',
                    foreignField: '_id',
                    as: 'replyUser', // Alias for populated reply user
                },
            },
            {
                $unwind: {
                    path: '$replyUser',
                    preserveNullAndEmptyArrays: true, // Keep replies without user information
                },
            },
            {
                $lookup: {
                    from: 'users', // Populate the user who made the post
                    localField: 'user', // Field that references the user who made the post
                    foreignField: '_id',
                    as: 'postUser', // Alias for populated post user
                },
            },
            {
                $unwind: {
                    path: '$postUser',
                    preserveNullAndEmptyArrays: true, // Keep posts without user information
                },
            },
            {
                $group: {
                    _id: '$_id', // Group back by post ID
                    text: { $first: '$text' }, // Include other fields as needed
                    image: { $first: '$image' },
                    gif: { $first: '$gif' },
                    reply: { $first: '$reply' },
                    repost: { $first: '$repost' },
                    likeCount: { $first: '$likeCount' },
                    likes: { $addToSet: '$likes' }, // Use $addToSet to collect unique likes
                    share: { $first: '$share' },
                    time: { $first: '$time' },
                    bookmarks: { $addToSet: '$bookmarks' }, // Use $addToSet to collect unique bookmarks
                    totalReplies: { $addToSet: '$totalReplies' }, // Keep unique totalReplies
                    replies: {
                        $push: {
                            _id: '$replies._id',
                            text: '$replies.text',
                            image: '$replies.image',
                            gif: '$replies.gif',
                            time: '$replies.time',
                            user: '$replyUser', // Include populated reply user details
                            likes: '$replies.likes', // Directly reference likes from replies
                            likeCount: '$replies.likeCount', // Directly reference likeCount from replies
                            repost: '$replies.repost', // Directly reference repost from replies
                            reply: '$replies.reply', // Directly reference reply from replies
                            bookmarks: '$replies.bookmarks', // Directly reference bookmarks from replies
                            share: '$replies.share', // Directly reference share from replies
                            post: '$replies.post', // Reference to the parent post
                            totalReplies: '$replies.totalReplies' // Reference to nested replies
                        },
                    },                    
                    postUser: { $first: '$postUser' }, // Include the user who made the post
                },
            },
            {
                $sort: { time: -1 }, // Sort by time in descending order
            },
        ]);

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getRepliesByUser };
