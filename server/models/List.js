const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  membersCount: { type: Number, default: "0" },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],
  createdAt: { type: String },
});

module.exports = mongoose.model("List", ListSchema);
