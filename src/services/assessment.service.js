/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { Assessment, Student } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Assessment
 * @param {Object} reqBody
 * @returns {Promise<Assessment>}
 */
const createAssessment = async (reqBody) => {
  // Try to find an assessment for the given studentId
  let assessment = await Assessment.findOne({ studentId: reqBody.studentId });
  const school = await Student.findOne({ studentId: reqBody.studentId }).select('schoolId standard');
  // If assessment found, update it with the new data
  reqBody.SchoolId = school.SchoolId;
  reqBody.standard = school.standard;
  if (assessment) {
    assessment = await Assessment.findOneAndUpdate(
      { studentId: reqBody.studentId },
      reqBody,
      { new: true } // Return the updated document
    );
  } else {
    // If assessment not found, create a new one
    assessment = await Assessment.create(reqBody);
  }

  return assessment;
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
const queryAssessment = async (filter, options) => {
  const result = await Assessment.paginate(filter, options);
  return result;
};

const getAssessmentById = async (id) => {
  return Assessment.findById(id);
};

// const getHighlights = async (studentId) => {
//   const report = await Assessment.findOne({ studentId });

//   if (!report) {
//     throw new Error('No report found for the given studentId');
//   }

//   // Calculate Aptitude counts
//   const aptitudeCounts = report.appitude
//     ? report.appitude.reduce((acc, apt) => {
//         if (acc[apt.factor_name]) {
//           acc[apt.factor_name]++;
//         } else {
//           acc[apt.factor_name] = 1;
//         }
//         return acc;
//       }, {})
//     : {};

//   // Calculate Personality counts
//   const personalityCounts = report.personality
//     ? report.personality.reduce((acc, pers) => {
//         if (acc[pers.factor_name]) {
//           acc[pers.factor_name]++;
//         } else {
//           acc[pers.factor_name] = 1;
//         }
//         return acc;
//       }, {})
//     : {};

//   // Calculate Interest counts
//   const interestCounts =
//     report.interest && report.interest.scoreWiseData
//       ? report.interest.scoreWiseData.reduce((acc, int) => {
//           if (acc[int.factor_name]) {
//             acc[int.factor_name]++;
//           } else {
//             acc[int.factor_name] = 1;
//           }
//           return acc;
//         }, {})
//       : {};

//   // Get Top 4 Career Cluster Fitments
//   const careerClusterFitments = report.career_fitments
//     ? report.career_fitments.map((career) => ({
//         career_name: career.career_name,
//         fitment: career.fitment,
//       }))
//     : [];

//   careerClusterFitments.sort((a, b) => b.fitment - a.fitment);
//   const top4CareerClusterFitments = careerClusterFitments.slice(0, 4);

//   return {
//     aptitudeCounts,
//     personalityCounts,
//     interestCounts,
//     top4CareerClusterFitments,
//   };
// };

const getHighlights = async (studentId) => {
  const report = await Assessment.findOne({ studentId });

  if (!report) {
    throw new Error('No report found for the given studentId');
  }

  // Calculate Aptitude counts
  const aptitudeCounts = report.appitude
    ? report.appitude.map((apt) => ({
        factor_name: apt.factor_name,
        factor_score: apt.score,
      }))
    : [];

  // Calculate Personality counts
  const personalityCounts = report.personality
    ? report.personality.map((pers) => ({
        factor_name: pers.factor_name,
        factor_score: pers.score,
      }))
    : [];

  // Calculate Interest counts
  const interestCounts =
    report.interest && report.interest.scoreWiseData
      ? report.interest.scoreWiseData.map((int) => ({
          factor_name: int.factor_name,
          factor_score: int.score,
        }))
      : [];

  // Get Top 4 Career Cluster Fitments
  const careerClusterFitments = report.career_fitments
    ? report.career_fitments.map((career) => ({
        career_name: career.career_name,
        fitment: career.fitment,
      }))
    : [];

  careerClusterFitments.sort((a, b) => b.fitment - a.fitment);
  const top4CareerClusterFitments = careerClusterFitments.slice(0, 4);

  return {
    aptitudeCounts,
    personalityCounts,
    interestCounts,
    top4CareerClusterFitments,
  };
};

// const studentId = "STUD741187";
// getHighlightsTest(studentId)
//   .then(result => {
//     console.log('Highlights:', result);
//   })
//   .catch(error => {
//     console.error('Error getting highlights:', error);
//   });

/**
 * Update user by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Sansthan>}
 */
const updateAssessmentById = async (id, updateBody) => {
  const result = await getAssessmentById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assessment not found');
  }
  Object.assign(result, updateBody);
  await result.save();
  return result;
};

module.exports = {
  createAssessment,
  getHighlights,
  queryAssessment,
  getAssessmentById,
  updateAssessmentById,
};
