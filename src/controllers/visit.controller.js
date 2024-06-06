const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { visitService } = require('../services');

const createSchedule = catchAsync(async (req, res) => {
  const { trainer, schoolId, visitDate, time, standard } = req.body;
  const visit = await visitService.scheduleVisit(trainer, schoolId, visitDate, time, standard);
  res.status(httpStatus.CREATED).send(visit);
});

const getTrainerVisits = catchAsync(async (req, res) => {
  const { trainerId, status } = req.query;
  const visit = await visitService.getTrainerVisits(trainerId, status);
  res.status(httpStatus.CREATED).send(visit);
});

const updateVisitById = catchAsync(async (req, res) => {
  const { schoolId, standard, trainerId } = req.query;
  // eslint-disable-next-line prettier/prettier
  // const updateData = req.fileUrls.map(url => ({
  //   url,
  // }));
  const result = await visitService.updateVisitById(schoolId, standard, trainerId, req.updateData);
  res.status(httpStatus.CREATED).send(result);
});

const addInOutTIme = catchAsync(async (req, res) => {
  const { schoolId, standard, trainerId } = req.query;
  const result = await visitService.updateVisitById(schoolId, standard, trainerId, req.body);
  res.status(httpStatus.CREATED).send(result);
});
const getVisitsBySchoolId = catchAsync(async (req, res) => {
  const { schoolId } = req.params;
  const visit = await visitService.getVisitsBySchoolId(schoolId);
  res.status(httpStatus.CREATED).send(visit);
});

const getSchoolIdsAndStudentCount = catchAsync(async (req, res) => {
  const { trainerId } = req.query;
  const visit = await visitService.getSchoolIdsAndStudentCount(trainerId);
  res.status(httpStatus.CREATED).send(visit);
});
const getVisitById = catchAsync(async (req, res) => {
  const visit = await visitService.getVisitById(req.params.id);
  res.status(httpStatus.CREATED).send(visit);
});

const getTrainerDetails = catchAsync(async (req, res) => {
  const { schoolId, standard } = req.query;
  const visit = await visitService.getTrainerDetails(schoolId, standard);
  res.status(httpStatus.CREATED).send(visit);
});

const deleteVisit = catchAsync(async (req, res) => {
  const result = await visitService.deleteVisit(req.params.id);
  res.send(result);
});

// const updateTeacher = catchAsync(async (req, res) => {
//   const result = await teacherService.updateTeacherById(req.params.id, req.body);
//   res.send(result);
// });

module.exports = {
  createSchedule,
  getTrainerVisits,
  getVisitsBySchoolId,
  getSchoolIdsAndStudentCount,
  updateVisitById,
  deleteVisit,
  addInOutTIme,
  getVisitById,
  getTrainerDetails,
};
