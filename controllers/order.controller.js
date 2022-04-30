const orderService = require('../services/order.service');
const { existUserAddressId } = require('../services/user.service');
const { getNearBranches } = require('../services/restaurant.service');

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

module.exports = { addOrder };
