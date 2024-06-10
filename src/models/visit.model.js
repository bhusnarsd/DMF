const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const visitSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schoolId: {
      type: String,
      // ref: 'School',
    },
    visitDate: {
      type: Date,
      required: true,
    },
    cluster: {
      type: String,
    },
    time: {
      type: String,
    },
    standard: {
      type: String,
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      default: 'pending',
    },
    // files: [{ type: String }],
    file: {
      type: String,
    },
    file1: {
      type: String,
    },
    file2: {
      type: String,
    },
    isCLosedVisit: {
      type: Boolean,
      defualt: false,
    },
    inTime: {
      type: String,
    },
    outTime: {
      type: String,
    },
    inDate: {
      type: String,
    },
    outDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

visitSchema.plugin(toJSON);
visitSchema.plugin(paginate);

const Visit = mongoose.model('Visit', visitSchema);
module.exports = Visit;
