const restaurantBranchService = require('../services/restaurantBranch.service');
const { existUserAddressId } = require('../services/user.service');
const {
  addRestaurantBranchValidation,
  updateRestaurantBranchValidation,
} = require('../validationSchemas/restaurantValidation.schema');
const mongoose = require('mongoose');

const addRestaurantBranch = async (req, res) => {
  try {
    const { error } = addRestaurantBranchValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const restBranch = req.body;
    try {
      const result = await restaurantBranchService.addRestaurantBranch(
        restBranch,
      );
      return res.status(200).json({ message: 'Branch added', result });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: 'internal server error ' });
  }
};

const getNearRestaurantBranch = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.addressId))
      return res.status(422).json({ error: true, message: 'wrong address id' });

    const userId = req.user._id;

    const userAddress = await existUserAddressId(userId, req.body.addressId);
    if (!userAddress)
      return res.status(422).json({
        error: true,
        message: 'address not found or not belong to the user',
      });

    const { addressId } = req.body;
    const nearBranches = await restaurantBranchService.getNearRestaurantBranch(
      addressId,
    );
    return res.status(200).json({ message: 'Near branches:', nearBranches });
  } catch (error) {
    res.status(500).json({ error: true, message: 'internal server error ' });
  }
};

const deleteRestaurantBranch = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong Branch id' });

    try {
      await restaurantBranchService.deleteRestaurantBranch(req.params.id);

      return res
        .status(200)
        .json({ error: false, message: 'Resturant Branch Deleted' });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: 'internal server error ' });
  }
};

const updateRestaurantBranch = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong Branch id' });

    const { error } = updateRestaurantBranchValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    try {
      const restBranchInfo = req.body;
      const updatedBranch =
        await restaurantBranchService.updateRestaurantBranch(
          req.params.id,
          restBranchInfo,
        );

      return res.status(200).json({
        error: false,
        message: 'Resturant Branch Updated',
        updatedBranch,
      });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: 'internal server error ' });
  }
};

module.exports = {
  addRestaurantBranch,
  deleteRestaurantBranch,
  updateRestaurantBranch,
  getNearRestaurantBranch,
};
