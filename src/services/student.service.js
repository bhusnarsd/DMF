/* eslint-disable no-param-reassign */
const Jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const { Student, User, Assessment } = require('../models');
const ApiError = require('../utils/ApiError');

const bulkUpload = async (studentArray, csvFilePath = null) => {
  let modifiedStudentsArray = studentArray;
  if (csvFilePath) {
    modifiedStudentsArray = { students: csvFilePath };
  }
  if (!modifiedStudentsArray.students || !modifiedStudentsArray.students.length)
    return { error: true, message: 'missing array' };

  const records = [];
  const dups = [];

  await Promise.all(
    modifiedStudentsArray.students.map(async (student) => {
      const schoolFound = await Student.findOne({ mobNumber: student.mobNumber, firstName: student.firstName });
      if (schoolFound) {
        dups.push(student);
      } else {
        // eslint-disable-next-line no-inner-declarations
        function generateStudentIds() {
          const randomNumber = Math.floor(Math.random() * 900000) + 100000;
          return `STUD${randomNumber}`;
        }
        const studentId = generateStudentIds();
        student.studentId = studentId;
        student.password = 'admin@123';
        let record = new Student(student);
        record = await record.save();
        if (record) {
          records.push(student);

          // Create the student user
          await User.create({
            firstName: student.firstName,
            lastName: student.lastname,
            mobNumber: student.mobNumber,
            username: studentId,
            password: 'admin@123',
            role: 'student',
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

function generateStudentId() {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return `STUD${randomNumber}`;
}
/**
 * Create a Teacher
 * @param {Object} reqBody
 * @returns {Promise<Teacher>}
 */
const createStudent = async (reqBody) => {
  const studentId = generateStudentId();
  await User.create({
    firstName: reqBody.firstName,
    lastName: reqBody.lastname,
    mobNumber: reqBody.mobNumber,
    username: studentId,
    password: 'admin@123',
    role: 'student',
  });
  reqBody.studentId = studentId;
  reqBody.password = 'admin@123';
  return Student.create(reqBody);
};

const generateToken = async (studentId) => {
  const user = await Student.find({ studentId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'student not found');
  }
  const token = Jwt.sign({ unique_id: studentId }, 'keonjhar-prod@123');
  return { token };
};

/**
 * Query for sansthan
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStudent = async (filter, options) => {
  const result = await Student.paginateWithStudentStatus(filter, options);
  return result;
};

const getStudentAssessments = async (schoolId, standard) => {
  // Convert schoolId to string for consistent comparison
  const schoolIdStr = schoolId;

  // Find students by schoolId and standard
  const students = await Student.find({ schoolId: schoolIdStr, standard });

  // Extract studentIds from the found students
  const studentIds = students.map((student) => student.studentId);

  // Find assessments by studentIds
  const assessments = await Assessment.find({ studentId: { $in: studentIds } });
  const response = students.map((student) => {
    const studentAssessment = assessments.find((assessment) => assessment.studentId === student.studentId);
    return {
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      age: student.age,
      assessmentStatus: studentAssessment ? studentAssessment.status : 'non-started',
      id: student.id,
    };
  });

  return response;
};

// (async () => {
//   const schoolId = 'SCH636454';
//   const standard = '12'; // Replace with actual school ID
//   try {
//     const statistics = await getStudentAssessments(schoolId, standard);
//     console.log('School Statistics:', statistics);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// })();
const getStudentById = async (id) => {
  return Student.findById(id);
};
/**
 * Update user by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Sansthan>}
 */
const updateStudentById = async (id, updateBody) => {
  const result = await getStudentById(id);
  // const user = await User.findOne({ username: result.studentId });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  const user = await User.findOne({ username: result.studentId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  Object.assign(result, updateBody);
  user.save();
  await result.save();
  return result;
};
/**
 * Delete user by id
 * @param {ObjectId} schoolId
 * @returns {Promise<School>}
 */
const deleteStudentById = async (studentID) => {
  const student = await getStudentById(studentID);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  const user = await User.findOne({ username: student.studentId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  await student.remove();
  return student;
};

async function getStudentUserData() {
  const students = await Student.find({}, 'tenantId packageId firstName lastName gender mobNumber studentId standard');
  const users = await User.find({ role: 'student' }, 'username password');

  const userMap = new Map(users.map((user) => [user.username, user.password]));

  const mergedData = students.map((student) => ({
    tenantId: student.tenantId,
    packageId: student.packageId,
    firstName: student.firstName,
    lastName: student.lastName,
    gender: student.gender,
    mobile: student.mobNumber,
    uniqueId: student.studentId,
    class: student.standard,
    password: userMap.get(student.studentId),
  }));

  return mergedData;
}

async function writeCSV(data) {
  const csvWriter = createObjectCsvWriter({
    path: path.join(__dirname, '../students.csv'), // Ensure this path matches with the controller
    header: [
      { id: 'tenantId', title: 'Tenant ID' },
      { id: 'packageId', title: 'Package ID' },
      { id: 'firstName', title: 'First Name' },
      { id: 'lastName', title: 'Last Name' },
      { id: 'gender', title: 'Gender' },
      { id: 'mobile', title: 'Mobile' },
      { id: 'uniqueId', title: 'Unique ID' },
      { id: 'class', title: 'Class' },
      // { id: 'password', title: 'Password' },
    ],
  });

  await csvWriter.writeRecords(data);
}

module.exports = {
  getStudentAssessments,
  bulkUpload,
  createStudent,
  queryStudent,
  getStudentById,
  updateStudentById,
  generateToken,
  deleteStudentById,
  getStudentUserData,
  writeCSV,
};
