const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    mobNumber: Joi.number().allow('', null),
    password: Joi.string().required().custom(password),
    firstName: Joi.string(),
    lastName: Joi.string(),
    role: Joi.string()
      .required()
      .valid('user', 'admin', 'superadmin', 'student', 'trainer', 'cluster', 'school', 'department', 'skillTrainer'),
    asssignedTo: Joi.string().allow('', null),
    cluster: Joi.string().allow('', null),
  }),
};

const createTainer = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    mobNumber: Joi.number().allow('', null),
    firstName: Joi.string(),
    lastName: Joi.string(),
    role: Joi.string().required().valid('user', 'admin', 'superadmin', 'student', 'trainer', 'block_officer', 'school'),
    asssignedTo: Joi.string().allow('', null),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      username: Joi.string(),
      password: Joi.string().custom(password),
      mobNumber: Joi.number().allow('', null),
      firstName: Joi.string(),
      lastName: Joi.string(),
      asssignedTo: Joi.string(),
      cluster: Joi.string().allow('', null),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  createTainer,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
