const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { statisticService } = require('../services');

const createStatistic = catchAsync(async (req, res) => {
  const statistic = await statisticService.createStatitic(req.body);
  res.status(httpStatus.CREATED).send(statistic);
});

const getStatistics = catchAsync(async (req, res) => {
  const statistics = await statisticService.getStatistics(req.body);
  res.send(statistics);
});

module.exports = {
  createStatistic,
  getStatistics,
};
