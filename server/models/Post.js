const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  text: { type: String },
  image: { type: String },
  gif: { type: String },
  reply: { type: Number },
  totalReplies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  repost: { type: Number },
  likeCount: { type: Number },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  share: { type: Number },
  time: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tags: { type: [String] },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
