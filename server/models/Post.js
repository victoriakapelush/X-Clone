const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    text: { type: String },
    image: { type: String },
    reply: { type: Number },
    repost: { type: Number },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    share: { type: Number },
    time: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;