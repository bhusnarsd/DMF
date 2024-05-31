const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Student = require('./student.model');
const Visit = require('./visit.model');

const schoolSchema = mongoose.Schema({
  schoolId: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    index: 'text',
  },
  contact_number: {
    type: String,
  },
  contactPersonName: {
    type: String,
  },
  address: {
    type: String,
  },
  udisecode: {
    type: String,
  },
  district: {
    type: String,
  },
  districtCode: {
    type: String,
  },
  cluster: {
    type: String,
  },
  clusterCode: {
    type: String,
  },
  block: {
    type: String,
  },
  blockCode: {
    type: String,
  },
  lowestClass: {
    type: String,
  },
  highestClass: {
    type: String,
  },
  schoolType: {
    type: String,
  },
  locationType: {
    type: String,
  },
  tenantId: {
    type: Number,
    default: 58,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },
});

// Add plugins
schoolSchema.plugin(toJSON);
schoolSchema.plugin(paginate);

schoolSchema.statics.paginateWithStudentAndVisitCount = async function (filter, options) {
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
      results.map(async (school) => {
        const studentCount = await Student.countDocuments({ schoolId: school.schoolId });
        const visitCount = await Visit.countDocuments({ schoolId: school.schoolId });
        const visitCompletedCount = await Visit.countDocuments({ schoolId: school.schoolId, status: 'completed' });
        return { ...school.toObject(), studentCount, visitCount, visitCompletedCount };
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
const School = mongoose.model('School', schoolSchema);

module.exports = School;
