const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const { teacherValidation } = require('../../validations');
const { reqLifeTrainerController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'school', 'cluster', 'department'), reqLifeTrainerController.createRequest)
  .get(auth('superadmin', 'school', 'cluster', 'department'), reqLifeTrainerController.queryRequest);
router
  .route('/:id')
  .get(auth('superadmin', 'school', 'cluster', 'department'), reqLifeTrainerController.getRequestById)
  .delete(
    auth('superadmin', 'district_officer', 'division_officer', 'cluster', 'state_officer', 'block_officer'),
    reqLifeTrainerController.deleteRequestById
  );
module.exports = router;
