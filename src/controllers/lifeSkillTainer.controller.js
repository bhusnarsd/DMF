const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { lifeSkillTrainer } = require('../services');

const createSchedule = catchAsync(async (req, res) => {
  const { trainer, schoolId, visitDate, time } = req.body;
  const visit = await lifeSkillTrainer.scheduleVisit(trainer, schoolId, visitDate, time);
  res.status(httpStatus.CREATED).send(visit);
});

const getTrainerVisits = catchAsync(async (req, res) => {
  const { trainerId, status } = req.query;
  const visit = await lifeSkillTrainer.getTrainerVisits(trainerId, status);
  res.status(httpStatus.CREATED).send(visit);
});

const getVisitsBySchoolId = catchAsync(async (req, res) => {
  const { schoolId } = req.params;
  const visit = await lifeSkillTrainer.getVisitsBySchoolId(schoolId);
  res.status(httpStatus.CREATED).send(visit);
});

const getSchoolIdsAndStudentCount = catchAsync(async (req, res) => {
  const { trainerId } = req.query;
  const visit = await lifeSkillTrainer.getSchoolIdsAndStudentCount(trainerId);
  res.status(httpStatus.CREATED).send(visit);
});
// const updateTeacher = catchAsync(async (req, res) => {
//   const result = await teacherService.updateTeacherById(req.params.id, req.body);
//   res.send(result);
// });
const updateVisitById = catchAsync(async (req, res) => {
  const { schoolId, trainerId } = req.query;
  const updateData = {};
  if (req.files.file) updateData.file = req.files.file[0].path;
  if (req.files.file1) updateData.file1 = req.files.file1[0].path;
  if (req.files.file2) updateData.file2 = req.files.file2[0].path;
  const result = await lifeSkillTrainer.updateVisitById(schoolId, trainerId, updateData);
  res.status(httpStatus.CREATED).send(result);
});

const addInOutTIme = catchAsync(async (req, res) => {
  const { schoolId, trainerId } = req.query;
  const result = await lifeSkillTrainer.updateVisitById(schoolId, trainerId, req.body);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  createSchedule,
  getTrainerVisits,
  getVisitsBySchoolId,
  getSchoolIdsAndStudentCount,
  updateVisitById,
  addInOutTIme,
};
