const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const User = require('../../models/User');
const { format } = require("date-fns");

const sendMessage = async (req, res) => {
    try {
        const { receiver, text, image, gif } = req.body;
        const sender = req.user.id;

        const postDate = new Date();
        const formattedTime = format(postDate, "PPpp");

        // Find or create a conversation
        let conversation = await Conversation.findOne({
            sender,
            receivers: { $in: [receiver] } // Check if receiver is in the receivers array
        });

        if (!conversation) {
            conversation = new Conversation({
                sender,
                receivers: [receiver],
                messages: [],
            });
            await conversation.save();    
        }

        // Create a new message
        const message = new Message({
            sender,
            receiver,
            text,
            image,
            gif,
            conversation: conversation._id,
            time: formattedTime,
        });

        await message.save();

        // Add message to conversation
        await Conversation.findByIdAndUpdate(conversation._id, {
            $push: { messages: message._id }
        });

        // Update User Model
        await User.findByIdAndUpdate(sender, {
            $push: { messages: message._id, conversations: conversation._id }
        });
        await User.findByIdAndUpdate(receiver, {
            $push: { messages: message._id, conversations: conversation._id }
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Fetch messages for a conversation
const getMessages = async (req, res) => {
    try {
      const { conversationId } = req.params;
  
      const messages = await Message.find({ conversation: conversationId })
        .populate('sender')  
        .populate('receiver') 
        .populate({
            path: 'conversation',
            populate: [
              { path: 'participants' },
              { 
                path: 'messages',
              }
            ]
          })        
          .exec();
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  sendMessage,
  getMessages
};
