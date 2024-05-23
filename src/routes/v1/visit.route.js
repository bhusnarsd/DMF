const express = require('express');
const auth = require('../../middlewares/auth');
const { visitController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'), visitController.createSchedule);
//   auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer'),
// .get(studentvisitControllerController.getAllStudent);

// router.route('/genrate-token').get(studentController.generateToken);
router
  .route('/:trainerId')
  .get(auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'), visitController.getTrainerVisits);

router.route('/get-trainer-details/:schoolId').get(visitController.getVisitsBySchoolId);

router.route('/get-dashboard-counts').get(visitController.getSchoolIdsAndStudentCount);
//   .patch(auth('superadmin', 'block_officer'), studentController.updateStudent);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Visit
 *   description: APIs for managing sansthan data
 */

/**
 * @swagger
 * /visit:
 *   post:
 *     summary: Create a user
 *     description: Only admins can create other users.
 *     tags: [Visit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visit'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Visit'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
// /**
//  * @swagger
//  * /student:
//  *   get:
//  *     summary: Get all sansthan data
//  *     tags: [Student]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: name
//  *         in: query
//  *         description: Name of the sansthan (optional)
//  *         schema:
//  *           type: string
//  *     responses:
//  *       "200":
//  *         description: Successful operation
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   sansthanName:
//  *                     type: string
//  *                   registrationDist:
//  *                     type: string
//  *                   state:
//  *                     type: string
//  *                   mobNumber:
//  *                     type: number
//  *       "400":
//  *         $ref: '#/components/responses/BadRequest'
//  */
// /**
//  * @swagger
//  * /student/{id}:
//  *   get:
//  *     summary: Get sansthan data by ID
//  *     tags: [Student]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the sansthan
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *         description: sort by query in the form of field:desc/asc (ex. name:asc)
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *         default: 10
//  *         description: Maximum number of users
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           default: 1
//  *         description: Page number
//  *     responses:
//  *       "200":
//  *         description: Successful operation
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 sansthanName:
//  *                   type: string
//  *                 registrationDist:
//  *                   type: string
//  *                 state:
//  *                   type: string
//  *                 mobNumber:
//  *                   type: number
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  *
//  *   patch:
//  *     summary: Update sansthan data by ID
//  *     tags: [Student]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: ID of the
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *              $ref: '#/components/schemas/Teacher'
//  *     responses:
//  *       "200":
//  *         description: Successful operation
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 sansthanName:
//  *                   type: string
//  *                 registrationDist:
//  *                   type: string
//  *                 state:
//  *                   type: string
//  *                 mobNumber:
//  *                   type: number
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  *       "500":
//  *         $ref: '#/components/responses/InternalServer'
//  */
/**
 * @swagger
 * components:
 *   schemas:
 *     Visit:
 *       type: object
 *       properties:
 *         visitDate:
 *           type: string
 *           format: date-time
 *           description: The date and time of the visit
 *         schoolId:
 *           type: string
 *           description: The ID of the school being visited
 *         trainer:
 *           type: string
 *           description: The ID of the trainer assigned to the visit
 *       required:
 *         - visitDate
 *         - schoolId
 *         - trainer
 */
