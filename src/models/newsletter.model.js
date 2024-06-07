const mongoose = require('mongoose');

const newsLetterSchema = new mongoose.Schema(
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

const NewsLetter = mongoose.model('NewsLetter', newsLetterSchema);
module.exports = NewsLetter;
