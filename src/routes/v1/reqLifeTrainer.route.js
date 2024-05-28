const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const { teacherValidation } = require('../../validations');
const { reqLifeTrainerController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('superadmin', 'school', 'department'), reqLifeTrainerController.createRequest)
  .get(auth('superadmin', 'school', 'department'), reqLifeTrainerController.queryRequest);
router.route('/:id').get(auth('superadmin', 'school', 'department'), reqLifeTrainerController.getRequestById);
//   .patch(
//     auth('superadmin', 'district_officer', 'division_officer', 'state_officer', 'block_officer'),
//     requestController.updateTeacher
//   );
module.exports = router;