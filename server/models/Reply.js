const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReplySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    image: { type: String },
    gif: { type: String },
    time: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: { type: Number, default: 0 },
    repost: { type: Number },
    reply: { type: Number },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    share: { type: Number, default: 0 },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    totalReplies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }]
});

const Reply = mongoose.model('Reply', ReplySchema);
module.exports = Reply;