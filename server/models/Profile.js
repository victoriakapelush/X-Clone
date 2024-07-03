const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    updatedName: { type: String },
    posts: { type: String, default: '0' },
    profileBio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    registrationDate: { type: String },
    following: { type: String, default: '0' },
    followers: { type: String, default: '0' },
    profilePicture: { type: String , default: null },
    backgroundHeaderImage: { type: String, default: null }
});

module.exports = ProfileSchema;