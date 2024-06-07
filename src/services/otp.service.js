/* eslint-disable class-methods-use-this */
// const httpStatus = require('http-status');
const axios = require('axios');
const { Otp } = require('../models');
// const config = require('../config/config');
// const ApiError = require('../utils/ApiError');

// const sendSMS = async (phoneNumber, otp) => {
//   const url = 'https://vodafone-sms-api-url'; // Replace with Vodafone SMS API URL
//   const data = {
//     apiKey: process.env.VODAFONE_API_KEY,
//     senderId: process.env.VODAFONE_SENDER_ID,
//     message: `Dear User, Your OTP to reset password at the portal is ${otp} -Eduspark`,
//     to: phoneNumber,
//   };
//   try {
//     const response = await axios.post(url, data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// Function to send SMS
// const sendSMS = async (phoneNumber, otp) => {

// //   const { userId, senderId, url } = config.SMS;
// // console.log( userId, senderId, url)
//   try {
//     const response = await axios.get(`https://103.229.250.200/smpp/sendsms?username=vibgyorerp&password=erJ*N(69b&from=VIBSMS&to=${phoneNumber}&text=Dear Teacher ${otp} is your OTP for verification on Knoggles -VIBGYOR`);
//     // (url, {
//     //   params: {
//     //     username: userId,
//     //     password: 'erJ*N(69b',
//     //     from: senderId,
//     //     to: phoneNumber,
//     //     text: `Dear Teacher ${otp} is your OTP for verification on Knoggles -VIBGYOR`,
//     //   },
//     // });
// console.log(response.data)
//     return response.data;
//   } catch (error) {
//     console.error('Error sending SMS:', error.response ? error.response.data : error.message);
//     throw new Error('Failed to send SMS');
//   }
// };

const sendSMS = async (phoneNumber, otp) => {
  try {
    const url = `https://103.229.250.200/smpp/sendsms?username=vibgyorerp&password=erJ*N(69b&from=VIBSMS&to=${phoneNumber}&text=Dear Teacher ${otp} is your OTP for verification on Knoggles -VIBGYOR`;
    const response = await axios.get(url);
    console.log('SMS sent successfully:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response from SMS service:', error.response.data);
      console.error('Status code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from SMS service:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up SMS request:', error.message);
    }
    throw new Error('Failed to send SMS');
  }
};

// Example usage
// const phoneNumber = '9823525745';
// const otp = '12189';

// sendSMS(phoneNumber, otp)
//   .then(result => {
//     console.log('SMS sent successfully:', result);
//   })
//   .catch(error => {
//     console.error('Error sending SMS:', error.message);
//   });

// const sendSMS = async (phoneNumber, otp) => {
//   try {
//   let smsSend = await axios.get(`https://103.229.250.200/smpp/sendsms?username=vibgyorerp&password=erJ*N(69b&from=VIBSMS&to=${phoneNumber}&text=Dear Teacher ${otp} is your OTP for verification on Knoggles -VIBGYOR`);
//   console.log(smsSend)
//   return smsSend;
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     throw new Error('Failed to send SMS');
//   }
// };

// // Example usage
// const phoneNumber = 9823525745;
// const otp = '12189';

// sendSMS(phoneNumber, otp)
//   .then(result => {
//     console.log('SMS sent successfully:', result);
//   })
//   .catch(error => {
//     console.error('Error sending SMS:', error.message);
//   });

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
