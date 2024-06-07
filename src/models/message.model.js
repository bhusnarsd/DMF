const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
  },
  recipient: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread',
  },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
