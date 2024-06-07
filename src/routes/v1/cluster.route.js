const express = require('express');
const auth = require('../../middlewares/auth');
const { clusterController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(
    auth('admin', 'school', 'superadmin', 'student', 'trainer', 'cluster', 'department', 'skillTrainer'),
    clusterController.getStatsDash
  );
module.exports = router;
