const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { Assessment } = require('./assessment.model');

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

studentShema.statics.paginateWithStudentStatus = async function (filter, options) {
  let sort = '';
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push((order === 'desc' ? '-' : '') + key);
    });
    sort = sortingCriteria.join(' ');
  } else {
    sort = '-createdAt'; // Sort by createdAt field in descending order by default
  }

  let limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  // Set limit to null if not provided or less than or equal to zero
  if (!options.limit || limit <= 0) {
    limit = null;
  }

  const countPromise = this.countDocuments(filter).exec();
  let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

  if (options.populate) {
    options.populate.split(',').forEach((populateOption) => {
      docsPromise = docsPromise.populate(
        populateOption
          .split('.')
          .reverse()
          .reduce((a, b) => ({ path: b, populate: a }))
      );
    });
  }

  docsPromise = docsPromise.exec();

  return Promise.all([countPromise, docsPromise]).then(async (values) => {
    const [totalResults, results] = values;
    const totalPages = Math.ceil(totalResults / (limit || 1)); // Avoid division by zero when limit is null

    // Reverse results if the reverse option is true
    if (options.reverse) {
      results.reverse();
    }

    // Calculate student count and visit schedule count for each school
    const resultsWithStudentAndVisitCount = await Promise.all(
      results.map(async (student) => {
        const studentAssessmentStatus = await Assessment.findOne({ studentId: student.studentId }).select('status');
        return { ...student.toObject(), studentAssessmentStatus };
      })
    );

    const result = {
      results: resultsWithStudentAndVisitCount,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return Promise.resolve(result);
  });
};
/**
 * @typedef Student
 */
const Student = mongoose.model('Student', studentShema);
module.exports = Student;
