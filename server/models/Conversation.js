const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConversationSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receivers: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],  
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  updatedAt: { type: Date, default: Date.now },
});

ConversationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;