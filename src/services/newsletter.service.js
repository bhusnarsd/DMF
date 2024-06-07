// const httpStatus = require('http-status');
const { NewsLetter } = require('../models');
// const ApiError = require('../utils/ApiError')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const creatnewsLetter = async (userBody) => {
  return NewsLetter.create(userBody);
};

/**
 * get a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const getnewsGetNewsletter = async () => {
  return NewsLetter.find();
};

module.exports = {
  creatnewsLetter,
  getnewsGetNewsletter,
};
