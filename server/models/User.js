const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  originalUsername: { type: String }, 
  formattedUsername: { type: String, unique: true }, 
  email: { type: String },
  password: { type: String },
  profilePicture: { type: String , default: null },
  profileBio: { type: String, default: '' },
});

module.exports = mongoose.model("User", UserSchema);