const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Student, User, Visit, Synopsis } = require('../models');
const ApiError = require('../utils/ApiError');

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

  // Create new visit
  const visit = new Visit({
    trainer: trainerId,
    schoolId,
    visitDate,
    time,
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

  return visit; // Return the saved visit
};

// const scheduleVisit = async (trainerId, schoolId, visitDate, time, standard) => {
//   const visit = new Visit({
//     trainer: trainerId,
//     schoolId,
//     visitDate,
//     time,
//     standard,
//   });
//   await visit.save();
//   // Update trainer's visits
//   const trainer = await User.findById(trainerId);
//   if (!trainer) {
//     throw new Error('Trainer not found');
//   }
//   trainer.visits.push(visit._id);
//   await trainer.save();

//   return visit; // Return the saved visit
// };

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

// const trainerId = "6645ec9ac3deb1833d210467";
// getTrainerVisits(trainerId)
//   .then(async(result) => {

//     console.log('Trainer visits:', result);
//   })
//   .catch((error) => {
//     console.error('Error getting trainer visits:', error);
//   });

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

const getStudentById = async (id) => {
  return Student.findById(id);
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
  const startedSchools = await Synopsis.distinct('schoolId').then((schoolIds) => schoolIds.length);
  const counsellingCount = await Synopsis.countDocuments();
  return {
    studentCounts: studentCounts.reduce((acc, curr) => acc + curr.studentCount, 0),
    schoolCount,
    startedSchools,
    counsellingCount,
  };
};

// module.exports = getSchoolIdsAndStudentCount;

// Example usage
// const trainerId = '6645ec9ac3deb1833d210467'; // Replace with actual trainer ID
// getSchoolIdsAndStudentCount(trainerId)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// module.exports = getSchoolIdsAndStudentCount;

/**
 * Update visit by schoolId, standard, and trainer
 * @param {String} schoolId
 * @param {String} standard
 * @param {ObjectId} trainer
 * @param {Object} updateBody
 * @returns {Promise<Visit>}
 */
const updateVisitById = async (schoolId, standard, trainer, updateBody) => {
  const result = await Visit.findOne({ schoolId, standard, trainer });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
  }

  // // Check if the visit already has inTime and inDate set and we're trying to update them again
  // if ((updateBody.inTime || updateBody.inDate) && (result.inTime || result.inDate)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Visit already has inTime or inDate set');
  // }

  // // Check if the visit already has outTime and outDate set and we're trying to update them again
  // if ((updateBody.outTime || updateBody.outDate) && (result.outTime || result.outDate)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Visit already has outTime or outDate set');
  // }

  // // Check if the visit already has file or file1 set and we're trying to update them again
  // if ((updateBody.file || updateBody.file1) && (result.file || result.file1)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Visit already has file, file1, or file2 set');
  // }

  // Update the visit document with new data
  Object.assign(result, updateBody);
  await result.save();

  // Re-fetch the visit document after update
  const updatedResult = await Visit.findOne({ schoolId, standard, trainer });

  // Check if all conditions are met to set status to 'completed'
  const { inTime, outTime, inDate, outDate, file, file1 } = updatedResult;
  const totalStudents = await Student.countDocuments({ standard, schoolId });
  const totalSynopses = await Synopsis.countDocuments({ standard, schoolId });

  if (inTime && outTime && inDate && outDate && file && file1 && totalStudents === totalSynopses) {
    updatedResult.status = 'completed';
    await updatedResult.save();
  }

  return updatedResult;
};
// const updateVisitById = async (schoolId, standard, trainer, updateBody) => {
//   const result = await Visit.findOne({ schoolId, standard, trainer });
//   if (!result) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Visit not found');
//   }
//   Object.assign(result, updateBody);
//   await result.save();
//   return result;
// };

module.exports = {
  queryStudent,
  getStudentById,
  getSchoolIdsAndStudentCount,
  getTrainerVisits,
  getVisitsBySchoolId,
  updateVisitById,
  scheduleVisit,
};
