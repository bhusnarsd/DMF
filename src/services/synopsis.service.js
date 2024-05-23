// const httpStatus = require('http-status');
const { Synopsis, Student } = require('../models');
// const ApiError = require('../utils/ApiError');

/**
 * Create a Synopsis
 * @param {Object} reqBody
 * @returns {Promise<Assessment>}
 */
const createSynopsis = async (reqBody) => {
  const synopsis = await Synopsis.create(reqBody);
  // const data = await Student.
  return synopsis;
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
const querySynopsis = async (filter, options) => {
  const result = await Synopsis.paginate(filter, options);
  return result;
};

const getSynopsisById = async (studentId) => {
  return Synopsis.findOne({ studentId });
};
// /**
//  * Update user by id
//  * @param {ObjectId} id
//  * @param {Object} updateBody
//  * @returns {Promise<Sansthan>}
//  */
// const updateSynopsisById = async (id, updateBody) => {
//   const result = await getAssessmentById(id);
//   if (!result) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Assessment not found');
//   }
//   Object.assign(result, updateBody);
//   await result.save();
//   return result;
// };

module.exports = {
  createSynopsis,
  querySynopsis,
  getSynopsisById,
  //   updateAssessmentById,
};
