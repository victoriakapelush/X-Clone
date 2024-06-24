const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    profilePicture: { type: String , default: null },
    backgroundHeaderImage: { type: String, default: null },
    posts: { type: String, default: '0' },
    profileBio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    registationDate: { type: String },
    following: { type: String, default: '0' },
    followers: { type: String, default: '0' }
});

module.exports = ProfileSchema;