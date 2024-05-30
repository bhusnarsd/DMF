const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { assessmentService } = require('../services');

const createAssessment = catchAsync(async (req, res) => {
  const assessment = await assessmentService.createAssessment(req.body);
  res.status(httpStatus.CREATED).send(assessment);
});

const queryAssessment = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'studentId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await assessmentService.queryAssessment(filter, options);
  res.send(result);
});

const getAssessmentById = catchAsync(async (req, res) => {
  const result = await assessmentService.getAssessmentById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assessment not found');
  }
  res.send(result);
});
const getAssessmentHighlightsById = catchAsync(async (req, res) => {
  const result = await assessmentService.getHighlights(req.query.studentId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assessment not found');
  }
  res.send(result);
});

const updateAssessmentById = catchAsync(async (req, res) => {
  const result = await assessmentService.updateAssessmentById(req.params.id, req.body);
  res.send(result);
});

module.exports = {
  createAssessment,
  queryAssessment,
  getAssessmentHighlightsById,
  getAssessmentById,
  updateAssessmentById,
};
