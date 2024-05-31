const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};
// Sansthan register
const sansthanRegister = {
  body: Joi.object().keys({
    userID: Joi.string().required(),
    password: Joi.string().required().custom(password),
    sansthanName: Joi.string().required(),
    state: Joi.string().required(),
    registrationDist: Joi.string().required(),
    mobNumber: Joi.number().required(),
    otp: Joi.number().required(),
  }),
};
// Sansthan login
const sansthanLogin = {
  body: Joi.object().keys({
    userID: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const checkUserIdExist = {
  body: Joi.object().keys({
    userID: Joi.string(),
  }),
};
const verifyMobNumber = {
  body: Joi.object().keys({
    mobNumber: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    deviceToken: Joi.string().allow('', null),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const sendOtp = {
  body: Joi.object().keys({
    username: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    username: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    otp: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const resetPasswordWithUserName = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  sendOtp,
  refreshTokens,
  forgotPassword,
  resetPassword,
  resetPasswordWithUserName,
  verifyEmail,
  sansthanRegister,
  sansthanLogin,
  checkUserIdExist,
  verifyMobNumber,
};
