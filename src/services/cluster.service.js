/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const { Student, Assessment, User, Visit, School, LifeTrainerVisit } = require('../models');

/**
 * Get user by username
 * @param {string}
 * @returns {Promise<Result>}
 */

const getStatistClusterDash = async (cluster) => {
  const totalStudents = await Student.countDocuments({ cluster });
  const totalCounsellor = await User.countDocuments({ cluster, role: 'trainer' });
  const totalLifeSkillTrainer = await User.countDocuments({ cluster, role: 'skillTrainer' });
  const visitsPendingTrainer = await LifeTrainerVisit.countDocuments({ status: 'pending', cluster });
  const visitsCompletedTrainer = await LifeTrainerVisit.countDocuments({ status: 'completed', cluster });
  const visitsPending = await Visit.countDocuments({ status: 'pending', cluster });
  const visitsCompleted = await Visit.countDocuments({ status: 'completed', cluster });
  const toatalSchools = await School.countDocuments({ cluster });
  const assessmentCompeletedCount = await Assessment.countDocuments({ status: 'completed', cluster });
  const assessmentStartedCountCount = await Assessment.countDocuments({ status: 'started', cluster });
  const totalassement = assessmentCompeletedCount + assessmentStartedCountCount;
  const pendingAssessmentCount = totalStudents - totalassement;

  return {
    totalCounsellor,
    totalLifeSkillTrainer,
    visitsPendingTrainer,
    visitsCompletedTrainer,
    visitsPending,
    visitsCompleted,
    toatalSchools,
    totalStudents,
    assessmentCompeletedCount,
    assessmentStartedCountCount,
    pendingAssessmentCount,
  };
};

module.exports = {
  getStatistClusterDash,
};
