const orderService = require('../services/order.service');
const { existUserAddressId } = require('../services/user.service');
const { getNearBranches } = require('../services/restaurant.service');
const { Types } = require('mongoose');

const addOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { restaurant, items, address } = req.body;

    try {
      const userAddress = await existUserAddressId(req.user._id, address);
      if (!userAddress)
        return res.status(422).json({
          error: true,
          message: 'address not found or not belong to the user',
        });

      const nearRestaurantBranch = await getNearBranches(restaurant, address);
      if (!nearRestaurantBranch)
        return res.status(422).json({
          error: true,
          message: 'No near branches for this restaurant ',
        });
      const branchId = nearRestaurantBranch._id;

      const order = await orderService.addOrder(
        branchId,
        restaurant,
        items,
        userId,
        address,
      );
      return res
        .status(201)
        .json({ error: false, message: 'Order created', orderId: order._id });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: 'internal server error' });
  }
};

const listOrders = async (req, res) => {
  try {
    let status;
    const statusTypes = ['pending', 'accepted', 'rejected', 'canceled'];
    if (!req.query.status || !statusTypes.includes(req.query.status))
      status = 'pending';
    else status = req.query.status;

    const currentPage = req.query.page || 1;
    const perPage = req.query.perpage || 2;
    const userId = req.user._id;

    try {
      const orders = await orderService.listOrders(
        userId,
        status,
        currentPage,
        perPage,
      );

      return res.status(200).json({ errro: false, orders });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: 'internal server error' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong order id' });

    const order = await orderService.findById(req.params.id);
    if (!order || order.status !== 'pending')
      return res
        .status(422)
        .json({ error: true, message: 'You can cancel only Pending Orders' });

    const canceledOrder = await orderService.cancelOrder(
      req.user._id,
      req.params.id,
    );
    if (!canceledOrder)
      return res.status(422).json({
        error: true,
        message: 'order not found or not belong to user',
      });

    return res.status(200).json({ error: false, message: 'order canceled' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: 'internal server error' });
  }
};

module.exports = { addOrder, listOrders, cancelOrder };
