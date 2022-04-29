const Restaurant = require('../models/restaurant.model');
const Items = require('../models/items.model');
const Address = require('../models/address.model');
const RestaurantBranch = require('../models/restaurantBranch.model');

const findById = async (id) => {
  const restaurant = await Restaurant.findById(id);
  return restaurant;
};

const addRestaurant = async (restaurant) => {
  try {
    const result = await Restaurant.create(restaurant);
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

const addItem = async (restaurantId, itemId) => {
  try {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      $push: { items: itemId },
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

const getRestaurantList = async (currentPage, perPage, limitItems) => {
  const restaurants = Restaurant.find()
    .populate({
      path: 'items',
      select: ['name', 'available'],
      perDocumentLimit: limitItems,
      populate: {
        path: 'category',
        model: 'Category',
        select: 'name',
      },
    })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);
  return restaurants;
};

const getavailableMenuItems = async (restId, currentPage, perPage) => {
  const itemsList = await Items.find({
    restaurant: restId,
    available: true,
  })
    .populate({
      path: 'category',
      model: 'Category',
      select: 'name',
    })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  return itemsList;
};

const getAvailableItemsByCategory = async (
  restId,
  catId,
  currentPage,
  perPage,
) => {
  const itemsList = await Items.find(
    {
      restaurant: restId,
      available: true,
      category: catId,
    },
    { __v: 0, restaurant: 0 },
  )
    .populate({
      path: 'category',
      model: 'Category',
      select: 'name',
    })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);
  return itemsList;
};

const addBranch = async (restId, branchId) => {
  const restaurant = Restaurant.findByIdAndUpdate(restId, {
    $push: { branches: branchId },
  });
  return restaurant;
};

const removeBranch = async (restId, branchId) => {
  const restaurant = await Restaurant.findByIdAndUpdate(restId, {
    $pull: { branches: branchId },
  });
  return restaurant;
};

const getNearBranches = async (restId, addressId) => {
  try {
    const restaurant = await Restaurant.findById(restId);
    if (!restaurant) return Promise.reject(Error('restaurant not exist!'));

    const { branches } = restaurant;
    if (!branches)
      return Promise.reject(Error('restaurant have no branches yet'));

    const address = await Address.findById(addressId);
    const { coordinates } = address.address;

    const nearBranches = await RestaurantBranch.find(
      {
        _id: { $in: branches },
        'address.coordinates': {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $maxDistance: 5000,
          },
        },
      },
      { __v: 0 },
    ).populate('restaurant', 'name about');
    return nearBranches;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  findById,
  addRestaurant,
  getRestaurantList,
  addItem,
  getavailableMenuItems,
  getAvailableItemsByCategory,
  addBranch,
  removeBranch,
  getNearBranches,
};
