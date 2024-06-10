const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { newsLetterService } = require('../services');

const creatnewsLetter = catchAsync(async (req, res) => {
  req.body.file = req.updateData.file;
  const result = await newsLetterService.creatnewsLetter(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getnewsGetNewsletter = catchAsync(async (req, res) => {
  const result = await newsLetterService.creatnewsLetter(req.body);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  creatnewsLetter,
  getnewsGetNewsletter,
};
