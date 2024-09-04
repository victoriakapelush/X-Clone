const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = require("./Profile");

const UserSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  originalUsername: { type: String },
  formattedUsername: { type: String },
  email: { type: String },
  password: { type: String },
  profile: ProfileSchema,
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
});

module.exports = mongoose.model("User", UserSchema);
