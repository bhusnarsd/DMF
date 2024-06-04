const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const { studentController } = require('../../controllers');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({ storage });

router.route('/bulkupload').post(uploads.single('file'), studentController.bulkUploadFile);

router.route('/').post(studentController.createStudent).get(studentController.getAllStudent);

router.route('/get-by-school').get(studentController.getAllStudentBySchooolId);
router
  .route('/genrate-token')
  .get(auth('admin', 'school', 'superadmin', 'student', 'trainer'), studentController.generateToken);
router.get(
  '/export-students',
  auth('admin', 'school', 'superadmin', 'student', 'trainer'),
  studentController.generateCSVOfStudent
);

router
  .route('/:studentId')
  .get(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer'), studentController.getStudentById)
  .patch(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer'), studentController.updateStudent)
  .delete(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer'), studentController.deleteStudentById);

router
  .route('/update/:studentId')
  .patch(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer'), studentController.updateStudentByID);

router
  .route('/get-by-studentid/:studentId')
  .get(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer'), studentController.getStudentId);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: APIs for managing sansthan data
 */

/**
 * @swagger
 * /student/bulkupload:
 *   post:
 *     summary: Upload CSV file for bulk school data creation.
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: CSV file uploaded successfully.
 *       '400':
 *         description: Bad request. No file uploaded.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a user
 *     description: Only admins can create other users.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Teacher'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /student:
 *   get:
 *     summary: Get all sansthan data
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Name of the sansthan (optional)
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sansthanName:
 *                     type: string
 *                   registrationDist:
 *                     type: string
 *                   state:
 *                     type: string
 *                   mobNumber:
 *                     type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */
/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Get sansthan data by ID
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the sansthan
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sansthanName:
 *                   type: string
 *                 registrationDist:
 *                   type: string
 *                 state:
 *                   type: string
 *                 mobNumber:
 *                   type: number
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update sansthan data by ID
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Teacher'
 *     responses:
 *       "200":
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sansthanName:
 *                   type: string
 *                 registrationDist:
 *                   type: string
 *                 state:
 *                   type: string
 *                 mobNumber:
 *                   type: number
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServer'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *         age:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *       required:
 *         - name
 *         - email
 */
