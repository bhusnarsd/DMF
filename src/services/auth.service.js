const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { sendSMS, createOtp, generateOTP, verifyOtp } = require('./otp.service');

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (username, password, deviceToken) => {
  const user = await userService.getUserByEmail(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or password');
  }
  if (deviceToken) {
    Object.assign(user, { deviceToken });
    await user.save();
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Initiate password reset by sending OTP
 * @param {string} username
 * @returns {Promise}
 */
const initiatePasswordReset = async (username) => {
  // try {
  const user = await userService.getUserByEmail(username);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  const { mobileNumber } = user;
  const otp = generateOTP();
  // const message = `Your OTP for password reset is ${otp}. It is valid for 5 minutes. Do not share this OTP with anyone.`;

  await sendSMS(mobileNumber, otp);
  await createOtp(mobileNumber, otp);
  // } catch (error) {
  //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not initiate password reset');
  // }
};

/**
 * Reset password using OTP
 * @param {string} username
 * @param {string} otp
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPasswordWithOtp = async (username, otp, newPassword) => {
  try {
    const user = await userService.getUserByEmail(username);
    const { mobileNumber } = user;
    const isValidOtp = await verifyOtp(mobileNumber, otp);

    if (!isValidOtp) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
    }

    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPasswordWithUserName = async (username, oldPassword, newPassword) => {
  // try {
  // const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
  const user = await userService.getUserByUsename(username, oldPassword);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password reset failed');
  }
  await userService.updateUserById(user._id, { password: newPassword });
  // await Token.deleteMany({ user: user._id, type: tokenTypes.RESET_PASSWORD });
  // } catch (error) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  // }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  initiatePasswordReset,
  resetPasswordWithOtp,
  resetPasswordWithUserName,
  verifyEmail,
};
