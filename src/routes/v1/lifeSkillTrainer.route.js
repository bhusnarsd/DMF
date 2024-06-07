const express = require('express');
// const multer = require('multer');
// const path = require('path');
const auth = require('../../middlewares/auth');
const { lifeSkillController } = require('../../controllers');
const { upload, uploadFilesMiddleware } = require('../../utils/bucket');

const router = express.Router();

// const uploadPath = path.join(__dirname, '../../uploads');
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, uploadPath);
//   },
//   filename(req, file, cb) {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });
router
  .route('/')
  .post(
    auth('admin', 'school', 'superadmin', 'student', 'cluster', 'trainer', 'department', 'skillTrainer'),
    lifeSkillController.createSchedule
  );
router.route('/get-dashboard-counts').get(lifeSkillController.getSchoolIdsAndStudentCount);

router
  .route('/get')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'cluster', 'trainer', 'department', 'skillTrainer'),
    lifeSkillController.getTrainerVisits
  );

router.route('/get-trainer-details/:schoolId').get(lifeSkillController.getVisitsBySchoolId);

router.route('/get/android').get(lifeSkillController.getTrainerVisits);

router.route('/update').patch(
  // auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'),
  upload.array('files', 3),
  uploadFilesMiddleware,
  lifeSkillController.updateVisitById
);

router.route('/add-in-out-time').patch(lifeSkillController.addInOutTIme);
router.route('/delete/:id').delete(lifeSkillController.deleteVisit);
router.route('/get-by/:id').get(lifeSkillController.getVisitById);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: LifeSkillVisit
 *   description: APIs for managing sansthan data
 */

/**
 * @swagger
 * /skill-trainer/update:
 *   patch:
 *     summary: Upload multiple files
 *     description: Upload multiple files to Google Cloud Storage and save their URLs to the database
 *     tags: [LifeSkillVisit]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: ID of the school
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: string
 *         description: ID of the trainer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Successful upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: https://storage.googleapis.com/bucket-name/file-name.jpg
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: Error uploading files or saving URLs to the database
 */
