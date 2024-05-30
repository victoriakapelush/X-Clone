const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String },
  email: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("User", UserSchema);