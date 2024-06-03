const httpStatus = require('http-status');
const { join } = require('path');
const csv = require('csvtojson');
const path = require('path');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { studentService } = require('../services');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const staff = await studentService.bulkUpload(null, csvJsonArray);
    res.status(httpStatus.CREATED).send(staff);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});
const createStudent = catchAsync(async (req, res) => {
  const teacher = await studentService.createStudent(req.body);
  res.status(httpStatus.CREATED).send(teacher);
});

// const getAllStudent = catchAsync(async (req, res) => {
//   const filter = {
//     ...pick(req.query, ['name']),
//     // isVerified: true,
//   };
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await studentService.queryStudent(filter, options);
//   res.send(result);
// });

const getAllStudent = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'schoolId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'reverse']);
  const result = await studentService.queryStudent(filter, options);
  res.send(result);
});

const getAllStudentBySchooolId = catchAsync(async (req, res) => {
  const { schoolId, standard } = req.query;
  const result = await studentService.getStudentAssessments(schoolId, standard);
  res.send(result);
});

const getStudentById = catchAsync(async (req, res) => {
  const result = await studentService.getStudentById(req.params.studentId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  res.send(result);
});

const getStudentId = catchAsync(async (req, res) => {
  const result = await studentService.getStudentId(req.params.studentId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  res.send(result);
});

const generateToken = catchAsync(async (req, res) => {
  const { studentId } = req.query;
  const token = await studentService.generateToken(studentId);
  res.send(token);
});

const generateCSVOfStudent = catchAsync(async (req, res) => {
  const data = await studentService.getStudentUserData();
  await studentService.writeCSV(data);

  const filePath = path.join(__dirname, '../students.csv'); // Ensure the path is correct

  res.download(filePath, 'students.csv', (err) => {
    if (err) {
      res.status(500).send('Error sending file');
    }
    // else {
    //   fs.unlink(filePath, (err) => {
    //     if (err) {
    //       console.error('Error deleting file:', err);
    //     }
    //   });
    // }
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const result = await studentService.updateStudentById(req.params.studentId, req.body);
  res.send(result);
});

const deleteStudentById = catchAsync(async (req, res) => {
  const student = await studentService.deleteStudentById(req.params.studentId);
  res.send(student);
});

module.exports = {
  bulkUploadFile,
  createStudent,
  getAllStudent,
  getStudentById,
  generateToken,
  updateStudent,
  deleteStudentById,
  generateCSVOfStudent,
  getAllStudentBySchooolId,
  getStudentId,
};
