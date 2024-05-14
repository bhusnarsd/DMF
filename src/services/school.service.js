const httpStatus = require('http-status');
const { School, User } = require('../models');
const ApiError = require('../utils/ApiError');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolsArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolsArray = { schools: csvFilePath };
  }
  if (!modifiedSchoolsArray.schools || !modifiedSchoolsArray.schools.length)
    return { error: true, message: 'missing array' };

  const records = [];
  const dups = [];

  await Promise.all(
    modifiedSchoolsArray.schools.map(async (school) => {
      const schoolFound = await School.findOne({ udisecode: school.udisecode });
      if (schoolFound) {
        dups.push(school);
      } else {
        function generateSchoolId() {
          const randomNumber = Math.floor(Math.random() * 900000) + 100000;
          return `SCH${randomNumber}`;
        }
        const schoolId = generateSchoolId();
        let record = new School({...school, schoolId});
        record = await record.save();
        if (record) {
          records.push(school);
          await User.create({
            firstName: school.firstname,
            lastName:  school.lastname,
            mobNumber: school.mobNumber,
            username: schoolId,
            password: 'admin@123',
            role: 'school',
          });
        }
      }
    })
  );

  const duplicates = {
    totalDuplicates: dups.length ? dups.length : 0,
    data: dups.length ? dups : [],
  };
  const nonduplicates = {
    totalNonDuplicates: records.length ? records.length : 0,
    data: records.length ? records : [],
  };
  return { nonduplicates, duplicates };
};

function generateSchoolId() {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return `SCH${randomNumber}`;
}
/**
 * Create a school
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const createSchool = async (reqBody) => {
  const schoolId = generateSchoolId()
  const data = {
    firtstName: reqBody.firstName,
    lastName: reqBody.lastName,
    username: schoolId,
    password: 'admin@123',
    role: 'school',
     asssignedTo,
  };
  await userService.createUser(data);
  return School.create({...reqBody, schoolId});
};

/**
 * Query for school
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySchool = async (filter, options) => {
  const school = await School.paginate(filter, options);
  return school;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<School>}
 */
const getSchoolByScode = async (code) => {
  return School.findOne({ code });
};

/**
 * Get block names
 * @param {string}
 * @returns {Promise<School>}
 */
const getBlockList = async () => {
  const block = await School.find({}, { block: 1 }).distinct('block');
  return block;
};

/**
 * Get block names
 * @param {string} block
 * @returns {Promise<School>}
 */
const getSchoolList = async (block) => {
  const schools = await School.find({ block }, { name: 1, code: 1 });
  return schools;
};

/**
 * Update school by id
 * @param {ObjectId} scode
 * @param {Object} updateBody
 * @returns {Promise<School>}
 */
const updateSchoolByScode = async (scode, updateBody) => {
  const result = await getSchoolByScode(scode);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SChool not found');
  }
  Object.assign(result, updateBody);
  await result.save();
  return result;
};



module.exports = {
  createSchool,
  querySchool,
  getSchoolList,
  getBlockList,
  bulkUpload,
  updateSchoolByScode,
};
