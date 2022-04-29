const restaurantService = require('../services/restaurant.service');
const restaurantValidation = require('../validationSchemas/restaurantValidation.schema');
const mongoose = require('mongoose');

const addRestaurant = async (req, res) => {
  try {
    const { error } = restaurantValidation.addRestaurant(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const newRestaurant = await restaurantService.addRestaurant(req.body);
    return res.status(200).json({
      error: false,
      message: 'Restaurant Added!',
      Restaurant: newRestaurant,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'internal server error ' });
  }
};

const listRestaurant = async (req, res) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perpage || 2;
    const limitItems = req.query.limit_items || false;

    const restaurantList = await restaurantService.getRestaurantList(
      currentPage,
      perPage,
      limitItems,
    );
    return res.status(200).json({
      error: false,
      restaurantList,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'internal server error ' });
  }
};

const getavailableMenuItems = async (req, res) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perpage || 2;
    const restaurantId = req.params.restId;

    const items = await restaurantService.getavailableMenuItems(
      restaurantId,
      currentPage,
      perPage,
    );
    return res.status(200).json({
      error: false,
      items,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'internal server error ' });
  }
};

const getAvailableItemsByCategory = async (req, res) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perpage || 2;
    const restaurantId = req.params.restId;
    const categoryId = req.params.catId;

    const items = await restaurantService.getAvailableItemsByCategory(
      restaurantId,
      categoryId,
      currentPage,
      perPage,
    );

    return res.status(200).json({
      error: false,
      items,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: 'internal server error ' });
  }
};

const getNearBranches = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.addressId))
    return res.status(422).json({ error: true, message: 'wrong address id' });

  const { addressId } = req.body;

  const nearBranches = await restaurantService.getNearBranches(
    req.params.restId,
    addressId,
  );

  if (!nearBranches)
    return res.status(200).json({
      error: true,
      message: 'cannot find any branches near you for this restaurant',
    });

  return res.status(200).json(nearBranches);
};

module.exports = {
  addRestaurant,
  listRestaurant,
  getavailableMenuItems,
  getAvailableItemsByCategory,
  getNearBranches,
};
