const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProfileSchema = require('./Profile'); 
const PostSchema = require('./Post'); 

const UserSchema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    originalUsername: { type: String },
    formattedUsername: { type: String, unique: true },
    email: { type: String },
    password: { type: String },
    profile: ProfileSchema,
    post: [PostSchema]
});

module.exports = mongoose.model('User', UserSchema);
