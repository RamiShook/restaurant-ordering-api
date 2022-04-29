const Joi = require('joi');

const addRestaurant = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required().label('name'),
    about: Joi.string().required().label('about'),
    // eslint-disable-next-line newline-per-chained-call
    owner: Joi.string().required().label('owner'),
  });
  return schema.validate(body);
};

const addRestaurantBranchValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required().label('name'),
    // eslint-disable-next-line newline-per-chained-call
    restaurant: Joi.string().hex().length(24).required().label('restaurant_id'),
    address: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .required()
        .label('coordinates'),
    }),
  });
  return schema.validate(body);
};

const updateRestaurantBranchValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).label('name'),
    address: Joi.object({
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .label('coordinates'),
    }),
  });
  return schema.validate(body);
};

module.exports = {
  addRestaurant,
  addRestaurantBranchValidation,
  updateRestaurantBranchValidation,
};
