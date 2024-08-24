const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  image: { type: String },
  gif: { type: String },
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  time: { type: String },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;