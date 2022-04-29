/* eslint-disable newline-per-chained-call */
const Joi = require('joi');

const addItemValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required().label('name'),
    price: Joi.number().required().label('price'),
    category: Joi.string().hex().length(24).required().label('category_id'),
    restaurant: Joi.string().hex().length(24).required().label('restaurant_id'),
    available: Joi.boolean().label('available'),
  });
  return schema.validate(body);
};

const updateItemValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).label('name'),
    price: Joi.number().label('price'),
    category: Joi.string().hex().length(24).label('category_id'),
    available: Joi.boolean().label('available'),
  }).min(1);
  return schema.validate(body);
};

module.exports = { addItemValidation, updateItemValidation };
