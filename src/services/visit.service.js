const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Student, User, Visit, School } = require('../models');
const ApiError = require('../utils/ApiError');
const admin = require('../utils/firebase');

const sendNotification = async (deviceToken, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token: deviceToken,
  };
  await admin.messaging().send(message);
};

const scheduleVisit = async (trainerId, schoolId, visitDate, time, standard) => {
  // Check for duplicate visit
  const existingVisit = await Visit.findOne({
    trainer: mongoose.Types.ObjectId(trainerId),
    schoolId,
    visitDate,
    time,
    standard,
  });

  if (existingVisit) {
    throw new ApiError(httpStatus.CONFLICT, 'Visit scheduled already found');
  }
  const school = await School.find({ schoolId }).select('cluster');
  // Create new visit
  let cluster = '';
  if (school) {
    cluster = school.cluster;
  }

  // Create new visit
  const visit = new Visit({
    trainer: trainerId,
    schoolId,
    visitDate,
    time,
    cluster,
    standard,
  });
  await visit.save();

  // Update trainer's visits
  const trainer = await User.findById(trainerId);
  if (!trainer) {
    // throw new ApiError(httpStatus.CONFLICT, 'Visit scheduled already found');
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found');
  }
  trainer.visits.push(visit._id);
  await trainer.save();
  const { deviceToken } = trainer;
  if (deviceToken) {
    const body = `You have assined visit for${schoolId} date ${visitDate}`;
    const title = 'Visits';
    await sendNotification(deviceToken, title, body);
  }
  return visit; // Return the saved visit
};

const getTrainerVisitsAndroid = async (trainerId, status) => {
  const pipeline = [];

  if (status) {
    // If status is provided, filter by both trainerId and status
    pipeline.push({
      $match: { trainer: mongoose.Types.ObjectId(trainerId), status },
    });
  } else {
    // If status is not provided, filter only by trainerId
    pipeline.push({
      $match: { trainer: mongoose.Types.ObjectId(trainerId) },
    });
  }

  // Add remaining aggregation stages
  pipeline.push(
    {
      $lookup: {
        from: 'schools',
        localField: 'schoolId',
        foreignField: 'schoolId',
        as: 'school',
      },
    },
    {
      $unwind: '$school',
    },
    {
      $project: {
        _id: 1,
        visitDate: 1,
        time: 1,
        standard: 1,
        status: 1,
        createdAt: 1,
        school: '$school',
      },
    }
  );

  const visits = await Visit.aggregate(pipeline);
  return visits;
};

const getTrainerVisits = async (trainerId, status) => {
  const pipeline = [];

  if (status) {
    // If status is provided, filter by both trainerId and status
    pipeline.push({
      $match: { trainer: mongoose.Types.ObjectId(trainerId), status },
    });
  } else {
    // If status is not provided, filter only by trainerId
    pipeline.push({
      $match: { trainer: mongoose.Types.ObjectId(trainerId) },
    });
  }

  // Add remaining aggregation stages
  pipeline.push(
    {
      $lookup: {
        from: 'schools',
        localField: 'schoolId',
        foreignField: 'schoolId',
        as: 'school',
      },
    },
    {
      $unwind: '$school',
    },
    {
      $project: {
        _id: 1,
        visitDate: 1,
        time: 1,
        standard: 1,
        status: 1,
        createdAt: 1,
        school: '$school',
      },
    }
  );

  const visits = await Visit.aggregate(pipeline);
  return visits;
};

const getVisitsBySchoolId = async (schoolId) => {
  const visits = await Visit.find({ schoolId });
  if (!visits || visits.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visits not found');
  }
  const populatedVisits = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const visit of visits) {
    const { createdAt } = visit;
    // eslint-disable-next-line no-await-in-loop
    const counselor = await User.findOne({ _id: visit.trainer }).select('firstName lastName mobNumber');
    populatedVisits.push({ visit, counselor, createdAt });
  }
  return populatedVisits;
};

/**
 * Query for sansthan
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStudent = async (filter, options) => {
  const result = await Student.paginate(filter, options);
  return result;
};

const getVisitById = async (id) => {
  return Visit.findById(id);
};

const getTrainerDetails = async (studentId) => {
  const student = await Student.findOne({ studentId });
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'student not found');
  }
  const visitData = await Visit.findOne({ schoolId: student.schoolId, standard: student.standard });
  if (!visitData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }
  const tarinerDetails = await User.findOne({ _id: visitData.trainer });
  return { tarinerDetails, visitData };
};

const getSchoolIdsAndStudentCount = async (trainerId) => {
  const visits = await Visit.find({ trainer: mongoose.Types.ObjectId(trainerId) }).select('schoolId standard');
  const schoolStandardPairs = visits.map((visit) => ({ schoolId: visit.schoolId, standard: visit.standard }));

  const studentCounts = await Student.aggregate([
    {
      $match: {
        $or: schoolStandardPairs.map((pair) => ({
          schoolId: pair.schoolId,
          standard: pair.standard,
        })),
      },
    },
    {
      $group: {
        _id: { schoolId: '$schoolId', standard: '$standard' },
        studentCount: { $sum: 1 },
      },
    },
  ]);
  const schoolCount = new Set(schoolStandardPairs.map((pair) => pair.schoolId)).size;
  // const startedSchools = await Synopsis.distinct('schoolId').then((schoolIds) => schoolIds.length);
  // const counsellingCount = await Synopsis.countDocuments();

  const upcommingAssingedSchool = await Visit.countDocuments({ trainer: trainerId, status: 'pending' });
  const completedVisitCount = await Visit.countDocuments({ trainer: trainerId, status: 'completed' });
  return {
    studentCounts: studentCounts.reduce((acc, curr) => acc + curr.studentCount, 0),
    schoolCount,
    upcommingAssingedSchool,
    completedVisitCount,
  };
};

/**
 * Update visit by schoolId, standard, and trainer
 * @param {String} schoolId
 * @param {String} standard
 * @param {ObjectId} trainer
 * @param {Object} updateBody
 * @returns {Promise<Visit>}
 */
const updateVisitById = async (schoolId, standard, trainer, updateData) => {
  const result = await Visit.findOne({ schoolId, standard, trainer });
  // console.log(schoolId, standard, trainerId )
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }

  // Update the visit document with new file URLs
  // eslint-disable-next-line prettier/prettier
  result.files = updateData
  await result.save();

  // Re-fetch the visit document after update
  const updatedResult = await Visit.findOne({ schoolId, standard, trainer });

  // Check if all conditions are met to set status to 'completed'
  const { inTime, outTime, inDate, outDate, files } = updatedResult;
  if (inTime && outTime && inDate && outDate && files.length > 0) {
    updatedResult.status = 'completed';
    await updatedResult.save();
  }

  return updatedResult;
};

const deleteVisit = async (visitId) => {
  // Find the visit by ID
  const visit = await Visit.findById(visitId);
  if (!visit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }

  // Remove the visit from the trainer's visits array
  const trainer = await User.findById(visit.trainer);
  if (!trainer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found');
  }

  trainer.visits.pull(visitId);
  await trainer.save();

  // Delete the visit
  await visit.remove();

  return visit; // Return the deleted visit
};

module.exports = {
  queryStudent,
  getVisitById,
  getSchoolIdsAndStudentCount,
  getTrainerVisits,
  getVisitsBySchoolId,
  updateVisitById,
  scheduleVisit,
  deleteVisit,
  getTrainerDetails,
  getTrainerVisitsAndroid,
};
