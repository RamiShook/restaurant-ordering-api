const orderService = require('../services/order.service');

const addOrder = async (req, res) => {
  const userId = req.user._id;
  const { restaurant, items, address } = req.body;
};

module.exports = { addOrder };
