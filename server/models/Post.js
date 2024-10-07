const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  text: { type: String },
  image: { type: String },
  gif: { type: String },
  reply: { type: Number },
  totalReplies: [{ type: Schema.Types.ObjectId, ref: "Reply", default: [] }],
  repost: { type: Number },
  likeCount: { type: Number },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  share: { type: Number },
  time: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  tags: { type: [String] },
  repostedFrom: { type: Schema.Types.ObjectId, ref: "User", default: null },
  originalPostId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
  repostedTime: { type: String, default: null }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
