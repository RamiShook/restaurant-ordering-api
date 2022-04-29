const Order = require('../models/order.model');
const RestaurantBranch = require('../models/restaurantBranch.model');
const Item = require('../models/items.model');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');

const addOrder = async (req, res) => {
  try {
    const { branch, items, user, address, restaurant } = req.body;

    // check if address belong to user
    const addressUser = await User.find({ address: { $in: [address] } });
    if (!addressUser) return Promise.reject(Error('Cant find this address'));

    // check if item exist, available and belong to the same restaurant
    const itemsIds = items.map((e) => e.item);

    const existItems = await Item.find({
      _id: { $in: itemsIds },
      available: true,
      restaurant,
    });

    if (existItems.length !== itemsIds.length)
      return Promise.reject(Error('Some item may not available, or not exist'));

    const order = await Order.create({
      branch,
      items,
      user,
      address,
      restaurant,
    });
    return res.status(200).json(order);
  } catch (error) {
    return Promise.reject(err);
  }
};

module.exports = { addOrder };
