const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const requestLifeTainerSchema = new mongoose.Schema(
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
    cluster: {
      type: String,
    },
    schoolName: {
      type: String,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

requestLifeTainerSchema.plugin(toJSON);
requestLifeTainerSchema.plugin(paginate);

const ReqLifeTrainer = mongoose.model('ReqLifeTrainer', requestLifeTainerSchema);
module.exports = ReqLifeTrainer;
