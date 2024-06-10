const express = require('express');
const auth = require('../../middlewares/auth');
const { newsletterController } = require('../../controllers');
const { upload, uploadFilesMiddleware } = require('../../utils/bucket');

const router = express.Router();

router
  .route('/')
  .post(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'cluster', 'department', 'skillTrainer'),
    upload,
    uploadFilesMiddleware,
    newsletterController.creatnewsLetter
  )
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'cluster', 'department', 'skillTrainer'),
    newsletterController.getnewsGetNewsletter
  );
module.exports = router;
