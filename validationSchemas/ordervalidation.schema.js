const Joi = require('joi');

const addOrderValidation = (body) => {
  const items = Joi.object().keys({
    item: Joi.string().hex().length(24).required(),
    quantity: Joi.number().min(1).required(),
  });

  const schema = Joi.object({
    addressId: Joi.string().hex().length(24).required(),
    restaurantId: Joi.string().hex().length(24).required(),
    items: Joi.array().items(items),
  });
  return schema.validate(body);
};

module.exports = { addOrderValidation };
