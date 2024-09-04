const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  text: { type: String },
  image: { type: String },
  gif: { type: String },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  time: { type: String },
  sentBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
