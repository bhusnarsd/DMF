const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const { teacherValidation } = require('../../validations');
const { requestController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'school', 'cluster', 'department'), requestController.createRequest)
  .get(auth('superadmin', 'school', 'cluster', 'department'), requestController.queryRequest);
router
  .route('/:id')
  .get(auth('superadmin', 'school', 'cluster', 'department'), requestController.getRequestById)
  .delete(
    auth('superadmin', 'district_officer', 'cluster', 'division_officer', 'state_officer', 'block_officer'),
    requestController.deleteRequestById
  );
module.exports = router;
