const mongoose = require('mongoose');

const newsLetterSchema = new mongoose.Schema(
  {
    titel: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const NewsLetter = mongoose.model('NewsLetter', newsLetterSchema);
module.exports = NewsLetter;
