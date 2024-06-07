const express = require('express');
const auth = require('../../middlewares/auth');
const { statisticController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'), statisticController.createStatistic)
  .get(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'), statisticController.getStatistics);
router
  .route('/get-login-count')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department', 'skillTrainer'),
    statisticController.getUserByUsername
  );

router
  .route('/get-by-school')
  .get(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'), statisticController.getSchoolStatistics);

router
  .route('/get-by-school/admin-dashboard')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'cluster', 'department'),
    statisticController.getSchoolStatistics
  );

router
  .route('/get-by-filters')
  .get(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'), statisticController.getFilteredStatistics);
//   .patch(
//     auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer'),
//     assessmentController.updateAssessmentById
//   );
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Assessment
 *   description: APIs for managing sansthan data
 */

/**
 * @swagger
 * paths:
 *   /assessment:
 *     post:
 *       summary: Create a new assessment
 *       tags:
 *         - Assessment
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentId:
 *                   type: string
 *                   description: The ID of the student.
 *                 schoolId:
 *                   type: string
 *                   description: The ID of the school.
 *                 score:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   description: The scores of the assessment.
 *                 status:
 *                   type: string
 *                   enum: [not-started, started, completed]
 *                   description: The status of the assessment.
 *                 isReportGenerated:
 *                   type: boolean
 *                   description: Indicates if the report is generated.
 *                 reports:
 *                   type: object
 *                   properties:
 *                     long:
 *                       type: string
 *                       description: The long report.
 *                     short:
 *                       type: string
 *                       description: The short report.
 *                     preview:
 *                       type: string
 *                       description: The preview of the report.
 *                   required:
 *                     - long
 *                     - short
 *                     - preview
 *                   description: The report details.
 *       responses:
 *         '201':
 *           description: Created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Assessment'
 *         '400':
 *           description: Bad Request
 *         '500':
 *           description: Internal Server Error
 *       security:
 *         - bearerAuth: []
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
 *         caste:
 *           type: string
 *         gender:
 *           type: string
 *         age:
 *           type: integer
 *         mobNumber:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         address:
 *           type: string
 *         pinCode:
 *           type: integer
 *         reservationDetails:
 *           type: string
 *         marks:
 *           type: integer
 *         qualification:
 *           type: string
 *         yearOfPassing:
 *           type: integer
 *         persentage:
 *           type: string
 *         univercityName:
 *           type: string
 *         subject:
 *           type: string
 *         collegeName:
 *           type: string
 *         profssionalQualification:
 *           type: string
 *         isVerified:
 *           type: boolean
 *       required:
 *         - name
 *         - mobNumber
 *         - email
 */
