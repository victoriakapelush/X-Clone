const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  updatedAt: { type: String },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
