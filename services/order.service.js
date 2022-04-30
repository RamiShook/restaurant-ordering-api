const Order = require('../models/order.model');
const Item = require('../models/items.model');

const addOrder = async (branchId, restaurant, items, userId, address) => {
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
      branch: branchId,
      items,
      user: userId,
      address,
      restaurant,
    });

    return order;
  } catch (error) {
    return Promise.reject(error);
  }
};
module.exports = { addOrder };
