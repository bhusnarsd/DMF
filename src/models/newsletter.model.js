const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    titel: {
      type: String,
    },
    files: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
