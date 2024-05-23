const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const requestSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      // ref: 'School',
    },
    visitDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
    },
    standard: {
      type: String,
    },
    schoolName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.plugin(toJSON);
requestSchema.plugin(paginate);

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;