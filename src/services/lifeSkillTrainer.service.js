const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Student, User, LifeTrainerVisit, School } = require('../models');
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
const scheduleVisit = async (trainerId, schoolId, visitDate, time) => {
  // Check for duplicate visit
  const existingVisit = await LifeTrainerVisit.findOne({
    trainer: mongoose.Types.ObjectId(trainerId),
    schoolId,
    visitDate,
    time,
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
  const visit = new LifeTrainerVisit({
    trainer: trainerId,
    schoolId,
    visitDate,
    cluster,
    time,
  });
  await visit.save();

  // Update trainer's visits
  const trainer = await User.findById(trainerId);
  if (!trainer) {
    // throw new ApiError(httpStatus.CONFLICT, 'Visit scheduled already found');
    throw new ApiError(httpStatus.NOT_FOUND, 'Trainer not found');
  }
  trainer.visits.push(visit._id);
  const { deviceToken } = trainer;
  if (deviceToken) {
    const body = `You have assined visit for${schoolId} date ${visitDate}`;
    const title = 'Visits';
    await sendNotification(deviceToken, title, body);
  }
  await trainer.save();

  return visit; // Return the saved visit
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
  const visits = await LifeTrainerVisit.aggregate(pipeline);
  return visits;
};

const getVisitsBySchoolId = async (schoolId) => {
  const visits = await LifeTrainerVisit.find({ schoolId });
  if (!visits || visits.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visits not found');
  }
  const populatedVisits = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const visit of visits) {
    const { createdAt } = visit;
    // eslint-disable-next-line no-await-in-loop
    const counselor = await User.findOne({ _id: visit.trainer, role: 'skillTrainer' }).select(
      'firstName lastName mobNumber'
    );
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
  const result = await LifeTrainerVisit.paginate(filter, options);
  return result;
};

const getVisitById = async (id) => {
  return LifeTrainerVisit.findById(id);
};

const getSchoolIdsAndStudentCount = async (trainerId) => {
  // Fetch visits assigned to the trainer
  const visits = await LifeTrainerVisit.find({ trainer: mongoose.Types.ObjectId(trainerId) }).select('schoolId status');

  // Get unique school IDs
  const uniqueSchoolIds = [...new Set(visits.map((visit) => visit.schoolId))];
  const totalSchools = uniqueSchoolIds.length;

  // Count the total number of students in those schools
  const totalStudents = await Student.countDocuments({ schoolId: { $in: uniqueSchoolIds } });

  // Count visits by status
  const statusCounts = await LifeTrainerVisit.aggregate([
    { $match: { trainer: mongoose.Types.ObjectId(trainerId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Format status counts into an object
  const statusCountMap = statusCounts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  return {
    totalSchools,
    totalStudents,
    statusCounts: statusCountMap,
  };
};

/**
 * Update user by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Sansthan>}
 */

/**
 * Update visit by schoolId, standard, and trainer
 * @param {String} schoolId
 * @param {String} standard
 * @param {ObjectId} trainer
 * @param {Object} updateBody
 * @returns {Promise<Visit>}
 */

const updateVisitById = async (schoolId, trainer, req) => {
  const result = await LifeTrainerVisit.findOne({ schoolId, trainer });
  // console.log(schoolId, standard, trainerId )
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }
  // Check if inTime is already set and updateData contains inTime
  if (req.body.inTime && result.inTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'inTime already set');
  }

  // Check if outTime is already set and updateData contains outTime
  if (req.body.outTime && result.outTime) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'outTime already set');
  }
  // Update the visit document with new file URLs
  // eslint-disable-next-line prettier/prettier
  if (req.updateData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(req.updateData)) {
      result[key] = value;
    }
  }
  // if(req.updateData)  result.files = req.updateData;
  // // Update the visit document with new data from req.body
  if (req.body) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in req.body) {
      result[key] = req.body[key];
    }
  }
  await result.save();
  // if(req.updateData)  result.files = req.updateData;
  // // Update the visit document with new data from req.body
  // if (req.body) {
  //   for (const key in req.body) {
  //     result[key] = req.body[key];
  //   }
  // }
  // await result.save();

  // Re-fetch the visit document after update
  const updatedResult = await LifeTrainerVisit.findOne({ schoolId, trainer });

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
  const visit = await LifeTrainerVisit.findById(visitId);
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
};
