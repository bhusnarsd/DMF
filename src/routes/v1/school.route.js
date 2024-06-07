const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { schoolValidation } = require('../../validations');
const { schoolController } = require('../../controllers');

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

router
  .route('/bulkupload')
  .post(auth('admin', 'school', 'superadmin'), uploads.single('file'), schoolController.bulkUploadFile);
router.get(
  '/export-schools',
  auth('admin', 'school', 'superadmin', 'student', 'trainer', 'block_officer', 'department'),
  schoolController.generateCSVOfSchool
);
router
  .route('/')
  .post(auth('superadmin', 'school', 'department'), validate(schoolValidation.createSchools), schoolController.createSchool)
  .get(
    // auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'),
    // validate(schoolValidation.getSchools),
    schoolController.getSchools
  );

router.route('/get-block').get(
  auth('superadmin', 'school', 'department'),
  // validate(schoolValidation.getBlock),
  schoolController.getBlockList
);
router.route('/get-district').get(
  auth('superadmin', 'school', 'department'),
  // validate(schoolValidation.getBlock),
  schoolController.getDistrictList
);
router.route('/get-cluster').get(
  auth('superadmin', 'school', 'department'),
  // validate(schoolValidation.getBlock),
  schoolController.getClusterList
);

router.route('/get-schools').post(auth('superadmin', 'school', 'department'), schoolController.getSchoolList);
router.route('/get-stats/dashboard').get(auth('superadmin', 'school', 'department'), schoolController.getSchoolStats);

router
  .route('/get-stats/by-school/dashboard')
  .get(auth('superadmin', 'school', 'department'), schoolController.getSchoolstatsBySchoolID);
router
  .route('/get-school/by-schoolid/:schoolId')
  .get(auth('superadmin', 'school', 'cluster', 'department'), schoolController.getSchoolBySchoolID);
router
  .route('/:schoolId')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'),
    validate(schoolValidation.getSchool),
    schoolController.getSchool
  )
  .patch(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'),
    validate(schoolValidation.updateSchools),
    schoolController.updateSchool
  )
  .delete(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'),
    validate(schoolValidation.deleteSchools),
    schoolController.deleteSchoolById
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: School
 *   description: School management and retrieval
 */

/**
 * @swagger
 * /schools/bulkupload:
 *   post:
 *     summary: Upload CSV file for bulk school data creation.
 *     tags: [School]
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
 * /schools:
 *   post:
 *     summary: Create a new school
 *     description: Endpoint to create a new school record.
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mid:
 *                 type: integer
 *                 description: The school's ID.
 *               name:
 *                 type: string
 *                 description: The name of the school.
 *               code:
 *                 type: string
 *                 description: The school's code.
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the school.
 *               address:
 *                 type: string
 *                 description: The address of the school.
 *               date:
 *                 type: string
 *                 description: The date of establishment of the school.
 *               month:
 *                 type: integer
 *                 description: The month of establishment of the school.
 *               year:
 *                 type: integer
 *                 description: The year of establishment of the school.
 *               logo:
 *                 type: integer
 *                 description: The logo of the school.
 *               udisecode:
 *                 type: string
 *                 description: The UDISE code of the school.
 *               division:
 *                 type: string
 *                 description: The division of the school.
 *               district:
 *                 type: string
 *                 description: The district of the school.
 *               block:
 *                 type: string
 *                 description: The block of the school.
 *               sansthan:
 *                 type: string
 *                 description: The sansthan of the school.
 *               s_type:
 *                 type: string
 *                 description: The type of the school.
 *               management:
 *                 type: string
 *                 description: The management of the school.
 *               category:
 *                 type: string
 *                 description: The category of the school.
 *               status:
 *                 type: string
 *                 description: The status of the school.
 *               preprimaryavl:
 *                 type: string
 *                 description: The availability of preprimary classes in the school.
 *               initialization_year:
 *                 type: string
 *                 description: The initialization year of the school.
 *               lang:
 *                 type: integer
 *                 description: The latitude of the school location.
 *               lat:
 *                 type: integer
 *                 description: The longitude of the school location.
 *               student:
 *                 type: integer
 *                 description: The number of students in the school.
 *               staff:
 *                 type: integer
 *                 description: The number of staff in the school.
 *               resultlist:
 *                 type: array
 *                 description: The list of results.
 *                 items:
 *                   type: object
 *                   properties:
 *                     male:
 *                       type: integer
 *                       description: The number of male students.
 *                     female:
 *                       type: integer
 *                       description: The number of female students.
 *                     class:
 *                       type: string
 *                       description: The class name.
 *                     section:
 *                       type: string
 *                       description: The section name.
 *                     class_id:
 *                       type: string
 *                       description: The class ID.
 *                     section_id:
 *                       type: string
 *                       description: The section ID.
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Get all school
 *     description: Only admins can retrieve all school.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: school name
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: school district
 *       - in: query
 *         name: block
 *         schema:
 *           type: string
 *         description: school block
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
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/School'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/school-stats:
 *   get:
 *     summary: Get student and staff count by district
 *     description: Retrieve the total student and staff count for each district.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/mangment-wise/teacher/student-count:
 *   get:
 *     summary: Get student and staff count by district
 *     description: Retrieve the total student and staff count for each district.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/school-stats/division-wise:
 *   post:
 *     summary: Get student and staff count by division
 *     description: Retrieve the total student and staff count for each division.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - division
 *             properties:
 *               division:
 *                 type: string
 *             example:
 *               division: Nashik Division
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /schools/school-stats/district-wise:
 *   post:
 *     summary: Get student and staff count by division
 *     description: Retrieve the total student and staff count for each division.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - division
 *             properties:
 *               division:
 *                 type: string
 *             example:
 *               division: Nashik Division
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /schools/school-stats/block-wise:
 *   post:
 *     summary: Get student and staff count by division
 *     description: Retrieve the total student and staff count for each division.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - division
 *             properties:
 *               division:
 *                 type: string
 *             example:
 *               division: Nashik Division
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /schools/school-count/district-wise:
 *   get:
 *     summary: Get student and staff count by district
 *     description: Retrieve the total student and staff count for each district.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/school-count/block-wise/abcd:
 *   get:
 *     summary: Get student and staff count by district
 *     description: Retrieve the total student and staff count for each district.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/{udisecode}:
 *   get:
 *     summary: Get a school
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other school.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: udisecode
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/School'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /schools/get-district:
 *   get:
 *     summary: Get a school
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other school.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/School'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /schools/get-block:
 *   post:
 *     summary: Login
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               district:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/School'
 */

/**
 * @swagger
 * /schools/get-schools:
 *   post:
 *     summary: Login
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               block:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/School'
 */
/**
 * @swagger
 * /schools/filter/by-post:
 *   get:
 *     summary: Get a school
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other school.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: district
 *       - in: query
 *         name: block
 *         schema:
 *           type: string
 *         description: block
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/School'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /schools/student-class/wise-stats:
 *   get:
 *     summary: Get student and staff count by district
 *     description: Retrieve the total student and staff count for each district.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/filter/by-division/count-block-school:
 *   post:
 *     summary: Get student and staff count by division
 *     description: Retrieve the total student and staff count for each division.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - division
 *             properties:
 *               division:
 *                 type: string
 *             example:
 *               division: Nashik Division
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/filter/by-division/count-block-school/district-wise:
 *   post:
 *     summary: Get student and staff count by division
 *     description: Retrieve the total student and staff count for each division.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - district
 *             properties:
 *               district:
 *                 type: string
 *             example:
 *               district: AHMADNAGAR
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/get-schools-by-udisecodes:
 *   post:
 *     summary: Get student and staff count by division
 *     description: Retrieve the total student and staff count for each division.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - udisecodeArray
 *             properties:
 *               udisecodeArray:
 *                 type: array
 *             example:
 *               udisecodeArray: ["9250100101" , "9250100201"]
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /schools/filter/by-division/count-block-school/block-wise:
 *   post:
 *     summary: Get student and staff count by division
 *     description: Retrieve the total student and staff count for each division.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - block
 *             properties:
 *               block:
 *                 type: string
 *             example:
 *               block: 225-Ahmednagar City
 *     responses:
 *       "200":
 *         description: Successful response
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schools/{scode}:
 *   patch:
 *     summary: Update sansthan data by ID
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sansthanId
 *         in: path
 *         required: true
 *         description: ID of the sansthan
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mid:
 *                 type: integer
 *                 description: The school's ID.
 *               name:
 *                 type: string
 *                 description: The name of the school.
 *               code:
 *                 type: string
 *                 description: The school's code.
 *               contact_number:
 *                 type: string
 *                 description: The contact number of the school.
 *               address:
 *                 type: string
 *                 description: The address of the school.
 *               date:
 *                 type: string
 *                 description: The date of establishment of the school.
 *               month:
 *                 type: integer
 *                 description: The month of establishment of the school.
 *               year:
 *                 type: integer
 *                 description: The year of establishment of the school.
 *               logo:
 *                 type: integer
 *                 description: The logo of the school.
 *               udisecode:
 *                 type: string
 *                 description: The UDISE code of the school.
 *               division:
 *                 type: string
 *                 description: The division of the school.
 *               district:
 *                 type: string
 *                 description: The district of the school.
 *               block:
 *                 type: string
 *                 description: The block of the school.
 *               sansthan:
 *                 type: string
 *                 description: The sansthan of the school.
 *               s_type:
 *                 type: string
 *                 description: The type of the school.
 *               management:
 *                 type: string
 *                 description: The management of the school.
 *               category:
 *                 type: string
 *                 description: The category of the school.
 *               status:
 *                 type: string
 *                 description: The status of the school.
 *               preprimaryavl:
 *                 type: string
 *                 description: The availability of preprimary classes in the school.
 *               initialization_year:
 *                 type: string
 *                 description: The initialization year of the school.
 *               lang:
 *                 type: integer
 *                 description: The latitude of the school location.
 *               lat:
 *                 type: integer
 *                 description: The longitude of the school location.
 *               student:
 *                 type: integer
 *                 description: The number of students in the school.
 *               staff:
 *                 type: integer
 *                 description: The number of staff in the school.
 *               resultlist:
 *                 type: array
 *                 description: The list of results.
 *                 items:
 *                   type: object
 *                   properties:
 *                     male:
 *                       type: integer
 *                       description: The number of male students.
 *                     female:
 *                       type: integer
 *                       description: The number of female students.
 *                     class:
 *                       type: string
 *                       description: The class name.
 *                     section:
 *                       type: string
 *                       description: The section name.
 *                     class_id:
 *                       type: string
 *                       description: The class ID.
 *                     section_id:
 *                       type: string
 *                       description: The section ID.
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
