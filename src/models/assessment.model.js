const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const aptitudeSchema = new mongoose.Schema(
  {
    factor_id: Number,
    factor_name: String,
    score: Number,
    isUnderHighRange: Boolean,
    isUnderLowRange: Boolean,
    isUnderMidRange: Boolean,
  },
  { _id: false }
);

const personalitySchema = new mongoose.Schema(
  {
    factor_id: Number,
    factor_name: String,
    score: Number,
    isUnderHighRange: Boolean,
    isUnderLowRange: Boolean,
    isUnderMidRange: Boolean,
    dot_position: String,
  },
  { _id: false }
);

const interestScoreWiseDataSchema = new mongoose.Schema({
  factor_id: Number,
  factor_name: String,
  score: Number,
  isUnderHighRange: Boolean,
  isUnderLowRange: Boolean,
  isUnderMidRange: Boolean,
  int_report_message: String,
});

const interestSchema = new mongoose.Schema(
  {
    label: [String],
    values: [Number],
    scoreWiseData: [interestScoreWiseDataSchema],
  },
  { _id: false }
);

const careerFitmentSchema = new mongoose.Schema(
  {
    career_id: Number,
    fitment: Number,
    career_name: String,
    aptitude_fitment: Number,
    personality_fitment: Number,
    interest_fitment: Number,
  },
  { _id: false }
);
const reportSchema = mongoose.Schema(
  {
    long: {
      type: String,
    },
    short: {
      type: String,

    },
    preview: {
      type: String,
    },
  },
  { _id: false }
);

const assessmentSchema = mongoose.Schema(
  {
    studentId: {
      type: String,
    },
    standard: {
      type: String,
    },
    schoolId: {
      type: String,
    },
    score: {
      type: Map,
      of: Number,
    },
    status: {
      type: String,
      enum: ['not_started', 'started', 'completed'],
    },
    isReportGenerated: {
      type: Boolean,
    },
    reports: {
      type: reportSchema,
    },
    appitude: [aptitudeSchema],
    personality: [personalitySchema],
    interest: interestSchema,
    career_fitments: [careerFitmentSchema],
  },
  {
    timestamps: true,
  }
);

// Add plugins
assessmentSchema.plugin(toJSON);
assessmentSchema.plugin(paginate);

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
