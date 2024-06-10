const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reqLifeTrainerServices } = require('../services');

const createRequest = catchAsync(async (req, res) => {
  const teacher = await reqLifeTrainerServices.createRequest(req.body);
  res.status(httpStatus.CREATED).send(teacher);
});

const queryRequest = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'schoolId', 'cluster']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reqLifeTrainerServices.queryRequest(filter, options);
  res.send(result);
});

const getRequestById = catchAsync(async (req, res) => {
  const result = await reqLifeTrainerServices.getRequestById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  res.send(result);
});

const deleteRequestById = catchAsync(async (req, res) => {
  const result = await reqLifeTrainerServices.deleteRequestById(req.params.id);
  res.send(result);
});

// const updateTeacher = catchAsync(async (req, res) => {
//   const result = await teacherService.updateTeacherById(req.params.id, req.body);
//   res.send(result);
// });

module.exports = {
  deleteRequestById,
  createRequest,
  queryRequest,
  getRequestById,
};
