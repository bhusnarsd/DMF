const Joi = require('joi');

const createSchools = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    contact_number: Joi.string(),
    address: Joi.string(),
    udisecode: Joi.string(),
    district: Joi.string(),
    block: Joi.string(),
    locationType: Joi.string().allow('', null),
    schoolType: Joi.string().allow('', null),
    districtCode: Joi.string().allow('', null),
    cluster: Joi.string().allow('', null),
    clusterCode: Joi.string().allow('', null),
    blockCode: Joi.string().allow('', null),
    lowestClass: Joi.string().allow('', null),
    highestClass: Joi.string().allow('', null),
    longitude: Joi.string().allow('', null),
    contactPersonName: Joi.string().allow('', null),
    latitude: Joi.string().allow('', null),
  }),
};
const getSchools = {
  query: Joi.object().keys({
    name: Joi.string(),
    district: Joi.string(),
    block: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getSchoolsDistrict = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSchool = {
  params: Joi.object().keys({
    schoolId: Joi.string(),
  }),
};

const getBlock = {
  body: Joi.object().keys({
    district: Joi.string(),
  }),
};

const getSchoolByFilter = {
  query: Joi.object().keys({
    district: Joi.string(),
    block: Joi.string(),
  }),
};

const getStatsByDivision = {
  body: Joi.object().keys({
    division: Joi.string(),
  }),
};

const updateSchools = {
  params: Joi.object().keys({
    schoolId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      // mid: Joi.number(),
      // code: Joi.string(),
      name: Joi.string(),
      contact_number: Joi.string(),
      address: Joi.string(),
      udisecode: Joi.string(),
      district: Joi.string(),
      block: Joi.string(),
      locationType: Joi.string().allow('', null),
      schoolType: Joi.string().allow('', null),
      districtCode: Joi.string().allow('', null),
      cluster: Joi.string().allow('', null),
      clusterCode: Joi.string().allow('', null),
      blockCode: Joi.string().allow('', null),
      lowestClass: Joi.string().allow('', null),
      highestClass: Joi.string().allow('', null),
      longitude: Joi.string().allow('', null),
      contactPersonName: Joi.string().allow('', null),
      latitude: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteSchools = {
  params: Joi.object().keys({
    schoolId: Joi.string(),
  }),
};

module.exports = {
  createSchools,
  getSchools,
  getSchool,
  getSchoolByFilter,
  getBlock,
  getSchoolsDistrict,
  getStatsByDivision,
  updateSchools,
  deleteSchools,
};
