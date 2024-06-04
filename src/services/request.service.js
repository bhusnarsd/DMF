const httpStatus = require('http-status');
const { Request } = require('../models');
const ApiError = require('../utils/ApiError');
const upload = require('../utils/bucket');

/**
 * Create a Teacher
 * @param {Object} reqBody
 * @returns {Promise<Request>}
 */
const createRequest = async (reqBody) => {
  return Request.create(reqBody);
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
  const result = await Request.paginate(filter, options);
  return result;
};

// // Example usage
// (async () => {
//   const filter = {}; // Your filter criteria
//   const options = {
//     // sortBy: 'createdAt:desc',
//     // limit: 10,
//     schoolId: "SCH110923",
//     page: 1,
//   };
//   const paginatedResults = await queryRequest(filter, options);
//   console.log(paginatedResults);
// })();
// Example usage
const getRequestById = async (id) => {
  return Request.findById(id);
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
// upload()
module.exports = {
  createRequest,
  //   updateTeacherById,
  deleteRequestById,
  getRequestById,
  queryRequest,
};
