const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: { type: String },
    image: { type: String },
    reply: { type: String, default: '0' },
    repost: { type: String, default: '0' },
    like: { type: String, default: '0' },
    share: { type: String, default: '0' },
    time: { type: String }
});

module.exports = PostSchema; 
