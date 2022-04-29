const Joi = require('joi');

const addOrderValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required().label('name'),
    price: Joi.number().required().label('price'),
    category: Joi.string().hex().length(24).required().label('category_id'),
    restaurant: Joi.string().hex().length(24).required().label('restaurant_id'),
    available: Joi.boolean().label('available'),
  });
  return schema.validate(body);
};
