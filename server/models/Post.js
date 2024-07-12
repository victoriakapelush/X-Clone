const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: { type: String },
    image: { type: String },
    reply: { type: Number },
    repost: { type: Number },
    like: { type: Number },
    share: { type: Number },
    time: { type: String },
    updatedName: { type: String },
    formattedUsername: { type: String, unique: true },
    profilePicture: { type: String , default: null }
});

module.exports = PostSchema; 
