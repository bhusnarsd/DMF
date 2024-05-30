const express = require('express');
const auth = require('../../middlewares/auth');
const { assessmentController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(assessmentController.createAssessment)
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer', 'department'),
    assessmentController.queryAssessment
  );
router
  .route('/get-hightlights')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer', 'department'),
    assessmentController.getAssessmentHighlightsById
  );
router
  .route('/:id')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer', 'department'),
    assessmentController.getAssessmentById
  )
  .patch(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer', 'department'),
    assessmentController.updateAssessmentById
  );
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
 * /teacher:
 *   get:
 *     summary: Get all sansthan data
 *     tags: [Assessment]
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
 * /teacher/{id}:
 *   get:
 *     summary: Get sansthan data by ID
 *     tags: [Assessment]
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
 *     tags: [Assessment]
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
