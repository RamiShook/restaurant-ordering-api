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
    const orders = await Order.find({ user: userId, status })
      .populate([
        {
          path: 'items.item',
          select: ['name', 'price'],
          populate: {
            path: 'category',
            model: 'Category',
            select: 'name',
          },
        },
        {
          path: 'branch',
          select: 'name',
        },
        {
          path: 'address',
          select: 'label',
        },
        {
          path: 'restaurant',
          select: 'name',
        },
      ])
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
        user: userId,
      },
      { status: 'canceled' },
    );
    return canceledOrder;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { addOrder, findById, listOrders, cancelOrder };
