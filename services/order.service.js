const Order = require('../models/order.model');
const Item = require('../models/items.model');

const addOrder = async (user, restaurant, branch, items, userAddress) => {
  try {
    // check if item exist, available and belong to the same restaurant
    const itemsIds = items.map((e) => e.item);

    const existItems = await Item.find({
      _id: { $in: itemsIds },
      available: true,
      restaurant: restaurant._id,
    });

    if (existItems.length !== itemsIds.length)
      return Promise.reject(Error('Some item may not available, or not exist'));

    const order = await Order.create({
      user: { id: user._id, name: user.fullName },
      restaurant: { id: restaurant.id, name: restaurant.name },
      branch: { id: branch._id, name: branch.name, address: branch.address },
      items,
      address: {
        coordinates: userAddress.address.coordinates,
        completeAddress: userAddress.completeAddress,
      },
    });
    return order;
  } catch (error) {
    return Promise.reject(error);
  }
};

const listOrders = async (userId, status, currentPage, perPage) => {
  try {
    const orders = await Order.find({ 'user.id': userId, status })
      .populate({
        path: 'items.item',
        select: ['name', 'price'],
        populate: {
          path: 'category',
          model: 'Category',
          select: 'name',
        },
      })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return orders;
  } catch (error) {
    return Promise.reject(error);
  }
};

const findById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    return order;
  } catch (error) {
    return Promise.reject(error);
  }
};

const cancelOrder = async (userId, orderId) => {
  try {
    const canceledOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        'user.id': userId,
      },
      { status: 'canceled' },
    );
    return canceledOrder;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getOrderInfo = async (userId, orderId) => {
  try {
    const detailedOrder = await Order.findOne({
      _id: orderId,
      'user.id': userId,
    }).populate('items.item');

    return detailedOrder;
  } catch (error) {
    return Promise.reject(error);
  }
};

const orderAction = async (orderId, actionStatus) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
      },
      { status: actionStatus },
    );
    return order;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  addOrder,
  findById,
  listOrders,
  cancelOrder,
  getOrderInfo,
  orderAction,
};
