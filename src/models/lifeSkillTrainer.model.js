const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const lifeSkillVisitSchema = new mongoose.Schema(
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
    time: {
      type: String,
    },
    status: {
      type: String,
      default: 'pending',
    },
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

lifeSkillVisitSchema.plugin(toJSON);
lifeSkillVisitSchema.plugin(paginate);

const LifeTainer = mongoose.model('LifeTainer', lifeSkillVisitSchema);
module.exports = LifeTainer;
