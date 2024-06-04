const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const studentShema = mongoose.Schema(
  {
    schoolId: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
    },
    studentId: {
      type: String,
    },
    lastName: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
    },
    schoolName: {
      type: String,
    },
    about: {
      type: String,
    },
    parentName: {
      type: String,
    },
    adharNo: {
      type: String,
    },
    address: {
      type: String,
    },
    age: {
      type: Number,
    },
    mobNumber: {
      type: Number,
    },
    standard: {
      type: String,
    },
    tenantId: {
      type: Number,
      default: 58,
    },
    academicYear: {
      type: String,
    },
    packageId: {
      type: Number,
      default: 54,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
studentShema.plugin(toJSON);
studentShema.plugin(paginate);

studentShema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef Student
 */
const Student = mongoose.model('Student', studentShema);
module.exports = Student;
