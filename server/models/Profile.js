const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    updatedName: { type: String },
    posts: { type: Number },
    profileBio: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    registrationDate: { type: String },
    following: { type: Number },
    followers: { type: Number },
    profilePicture: { type: String , default: null },
    backgroundHeaderImage: { type: String, default: null }
});

module.exports = ProfileSchema;