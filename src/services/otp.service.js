/* eslint-disable class-methods-use-this */
// const httpStatus = require('http-status');
const axios = require('axios');
const { Otp } = require('../models');
// const ApiError = require('../utils/ApiError');

const sendSMS = async (phoneNumber, otp) => {
  const url = 'https://vodafone-sms-api-url'; // Replace with Vodafone SMS API URL
  const data = {
    apiKey: process.env.VODAFONE_API_KEY,
    senderId: process.env.VODAFONE_SENDER_ID,
    message: `Dear User, Your OTP to reset password at the portal is ${otp} -Eduspark`,
    to: phoneNumber,
  };
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const createOtp = async (mobNumber, otp) => {
  const otpDoc = {
    mobNumber,
    otp,
  };
  await Otp.create(otpDoc);
};

const generateOTP = () => {
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
};

const verifyOtp = async (mobNumber, otp) => {
  const otpDoc = await Otp.find({ mobNumber, otp });

  if (!otpDoc[0] || !otpDoc[0].otp) {
    throw new Error('Otp does not match');
  }

  await Otp.deleteMany({ mobNumber });

  return true;
};

module.exports = {
  sendSMS,
  createOtp,
  generateOTP,
  verifyOtp,
};
