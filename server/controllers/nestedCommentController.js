const { format } = require('date-fns');
const User = require('../models/User');
const Post = require('../models/Post');
const Reply = require('../models/Reply');

const getComments = async (req, res) => {
    const { replyId } = req.params; 

    try {
        const reply = await Reply.findById(replyId)
            .populate('user')
            .populate({
                path: 'totalReplies.user',
                model: 'User',
            });

        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addNestedComment = async (req, res) => {
    const { text, gif } = req.body;
    const currentUser = req.user.originalUsername;
    const replyId = req.params.replyId;

    try {
        let filename = null;
        if (req.file) {
            filename = req.file.filename;
        }

        const user = await User.findOne({ originalUsername: currentUser });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const commentDate = new Date(); 
        const formattedTime = format(commentDate, 'PPpp');

        const newReply = new Reply({
            text,
            image: filename,
            gif,
            time: formattedTime,
            reply: 0,
            totalReplies: [],
            repost: 0,
            likeCount: 0,
            likes: [],
            share: 0,
            user: user._id,
            post: replyId
        });

        const parentReply = await Reply.findById(replyId);
        if (!parentReply) {
            return res.status(404).json({ message: 'Reply not found' });
        }

        if (typeof parentReply.reply !== 'number') {
            parentReply.reply = 0;
        }

        parentReply.totalReplies.push(newReply);
        await parentReply.save();
        await newReply.save();

        const populatedParentReply = await Reply.findById(newReply._id)
        .populate('user')
        .populate('post');

        res.status(201).json({ message: 'Nested comment added successfully', comment: populatedParentReply });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getComments, addNestedComment };