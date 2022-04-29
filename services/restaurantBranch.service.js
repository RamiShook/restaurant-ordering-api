const RestaurantBranch = require('../models/restaurantBranch.model');
const Address = require('../models/address.model');
const restaurantService = require('./restaurant.service');
const Restaurant = require('../models/restaurant.model');

const addRestaurantBranch = async (restBranch) => {
  try {
    const restaurant = await Restaurant.findById(restBranch.restaurant);
    if (!restaurant)
      return Promise.reject(Error('No restaurant with given id'));

    const resturantBranch = await RestaurantBranch.create(restBranch);

    await restaurantService.addBranch(
      restBranch.restaurant,
      resturantBranch._id,
    );
    return resturantBranch;
  } catch (err) {
    return Promise.reject(err);
  }
};

const deleteRestaurantBranch = async (branchId) => {
  try {
    const restaurantBranch = await RestaurantBranch.findByIdAndDelete(branchId);
    if (!restaurantBranch)
      return Promise.reject(Error('no restaurant branch with given id'));

    await restaurantService.removeBranch(restaurantBranch.restaurant, branchId);
    return restaurantBranch;
  } catch (err) {
    return Promise.reject(err);
  }
};

const getNearRestaurantBranch = async (addressId) => {
  try {
    const address = await Address.findById(addressId);
    const { coordinates } = address.address;

    const nearBranches = await RestaurantBranch.find(
      {
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

const updateRestaurantBranch = async (restBranchId, restBranchInfo) => {
  try {
    const updatedBranch = await RestaurantBranch.findByIdAndUpdate(
      restBranchId,
      restBranchInfo,
      { returnOriginal: false },
    );

    if (!updatedBranch) return Promise.reject(Error('No Branch with given id'));

    return updatedBranch;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  addRestaurantBranch,
  getNearRestaurantBranch,
  deleteRestaurantBranch,
  updateRestaurantBranch,
};
