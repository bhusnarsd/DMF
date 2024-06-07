const httpStatus = require('http-status');
const { ReqLifeTrainer, School } = require('../models');
const ApiError = require('../utils/ApiError');

const queryRequest = async (filter, options) => {
  const limit = parseInt(options.limit, 10) || 10;
  const page = parseInt(options.page, 10) || 1;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || '';

  const [results, total] = await Promise.all([
    ReqLifeTrainer.find(filter).sort(sortBy).skip(skip).limit(limit).exec(),
    ReqLifeTrainer.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    results,
    total,
    limit,
    page,
    totalPages,
  };
};
/**
 * Create a Teacher
 * @param {Object} reqBody
 * @returns {Promise<Request>}
 */
const createRequest = async (reqBody) => {
  const school = await School.findOne({ schoolId: reqBody.schoolId }).select('cluster');
  reqBody.cluster = school.cluster;
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
// const queryRequest = async (filter, options) => {
//   const result = await ReqLifeTrainer.queryRequestS(filter, options);
//   return result;
// };

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
