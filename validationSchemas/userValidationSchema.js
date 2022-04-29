const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const updateUserInfoValidation = (body) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).label('fullName'),
    password: passwordComplexity().required().label('Password'),
  }).min(2);
  return schema.validate(body);
};

const updateUserPasswordValidation = (body) => {
  const schema = Joi.object({
    oldPassword: passwordComplexity().required().label('old password'),
    newPassword: passwordComplexity().required().label('new password'),
  });
  return schema.validate(body);
};

const userAddressValidation = (body) => {
  const schema = Joi.object({
    address: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .required()
        .label('coordinates'),
    }),
    completeAddress: Joi.object({
      street: Joi.string().required().label('street'),
      city: Joi.string().required().label('city'),
      building: Joi.string().required().label('building'),
    }),
    label: Joi.string().required().label('address label'),
  });
  return schema.validate(body);
};

const updateUserAddressValidation = (body) => {
  const schema = Joi.object({
    address: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .label('coordinates'),
    }),
    completeAddress: Joi.object({
      street: Joi.string().label('street'),
      city: Joi.string().label('city'),
      building: Joi.string().label('building'),
    }),
    label: Joi.string().label('address label'),
  }).min(1);
  return schema.validate(body);
};

module.exports = {
  updateUserInfoValidation,
  updateUserPasswordValidation,
  userAddressValidation,
  updateUserAddressValidation,
};
