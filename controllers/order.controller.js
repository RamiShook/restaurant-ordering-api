const orderService = require('../services/order.service');
const { existUserAddressId } = require('../services/user.service');
const { getNearBranches } = require('../services/restaurant.service');
const { Types } = require('mongoose');
const orderValidation = require('../validationSchemas/ordervalidation.schema');
const userService = require('../services/user.service');
const restaurantService = require('../services/restaurant.service');

const addOrder = async (req, res) => {
  try {
    const { error } = orderValidation.addOrderValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    try {
      const user = await userService.findById(req.user._id);

      const { restaurantId, items, addressId } = req.body;

      const restaurant = await restaurantService.findById(restaurantId);

      const existUserAddress = await existUserAddressId(
        req.user._id,
        addressId,
      );

      if (!existUserAddress)
        return res.status(422).json({
          error: true,
          message: 'address not found or not belong to the user',
        });

      const userAddress = await userService.getAddressInfo(addressId);

      const nearRestaurantBranch = await getNearBranches(restaurant, addressId);
      if (!nearRestaurantBranch)
        return res.status(422).json({
          error: true,
          message: 'No near branches for this restaurant ',
        });

      const order = await orderService.addOrder(
        user,
        restaurant,
        nearRestaurantBranch,
        items,
        userAddress,
      );
      return res
        .status(201)
        .json({ error: false, message: 'Order created', order });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (error) {
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
    return res
      .status(500)
      .json({ error: true, message: 'internal server error' });
  }
};

const getOrderInfo = async (req, res) => {
  try {
    const order = await orderService.getOrderInfo(req.user._id, req.params.id);
    if (!order)
      return res.status(422).json({
        error: true,
        message: 'Order not found or not belong to this user',
      });

    let totalPrice = 0;
    // eslint-disable-next-line array-callback-return
    order.items.map((e) => {
      totalPrice += e.item.price * e.quantity;
    });

    return res.status(200).json({ error: false, order, totalPrice });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: 'internal server error' });
  }
};

const orderAction = async (req, res) => {
  try {
    const { orderId, actionStatus } = req.params;

    const statusTypes = ['accepted', 'rejected'];
    if (!statusTypes.includes(actionStatus))
      return res.status(422).json({
        error: true,
        message: 'Status can be only accepted or rejected',
      });

    const order = await orderService.orderAction(orderId, actionStatus);
    if (!order)
      return res.status(422).json({
        error: true,
        message: 'Cannot find order',
      });

    return res
      .status(200)
      .json({ error: false, message: 'Order Status changed' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: 'internal server error' });
  }
};

module.exports = {
  addOrder,
  listOrders,
  cancelOrder,
  getOrderInfo,
  orderAction,
};
