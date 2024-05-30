const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../middlewares/auth');
const { lifeSkillController } = require('../../controllers');

const router = express.Router();

const uploadPath = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });
router
  .route('/')
  .post(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department', 'skillTrainer'),
    lifeSkillController.createSchedule
  );
router.route('/get-dashboard-counts').get(lifeSkillController.getSchoolIdsAndStudentCount);

router
  .route('/get')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department', 'skillTrainer'),
    lifeSkillController.getTrainerVisits
  );

router.route('/get-trainer-details/:schoolId').get(lifeSkillController.getVisitsBySchoolId);

router.route('/get/android').get(lifeSkillController.getTrainerVisits);

router.route('/update').patch(
  // auth('admin', 'school', 'superadmin', 'student', 'trainer', 'department'),
  upload.fields([{ name: 'file' }, { name: 'file1' }, { name: 'file2' }]),
  lifeSkillController.updateVisitById
);

router.route('/add-in-out-time').patch(lifeSkillController.addInOutTIme);
module.exports = router;
