const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { clusterService } = require('../services');

const getStatsDash = catchAsync(async (req, res) => {
  const { cluster } = req.query;
  const result = await clusterService.getStatistClusterDash(cluster);
  res.status(httpStatus.CREATED).send(result);
});
module.exports = {
  getStatsDash,
};
