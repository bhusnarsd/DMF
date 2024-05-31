const httpStatus = require('http-status');
const { ReqLifeTrainer } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Teacher
 * @param {Object} reqBody
 * @returns {Promise<Request>}
 */
const createRequest = async (reqBody) => {
  return ReqLifeTrainer.create(reqBody);
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
const queryRequest = async (filter, options) => {
  const result = await ReqLifeTrainer.paginate(filter, options);
  return result;
};

const getRequestById = async (id) => {
  return ReqLifeTrainer.findById(id);
};
// /**
//  * Update user by id
//  * @param {ObjectId} id
//  * @param {Object} updateBody
//  * @returns {Promise<Request>}
//  */
// const updateTeacherById = async (id, updateBody) => {
//   const result = await getTeacherById(id);
//   if (!result) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not found');
//   }
//   Object.assign(result, updateBody);
//   await result.save();
//   return result;
// };

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteRequestById = async (id) => {
  const request = await getRequestById(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  await request.remove();
  return request;
};

module.exports = {
  createRequest,
  //   updateTeacherById,
  deleteRequestById,
  getRequestById,
  queryRequest,
};
