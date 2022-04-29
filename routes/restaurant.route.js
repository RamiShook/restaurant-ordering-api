const { Router } = require('express');
const authMiddlware = require('../middlwares/auth.middlware');
const restaurantController = require('../controllers/restaurant.controller');

const router = Router();

router.post(
  '/restaurant',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  restaurantController.addRestaurant,
);

router.get(
  '/restaurant',
  authMiddlware.isLoggedIn,
  restaurantController.listRestaurant,
);

router.get(
  '/restaurant/:restId/available-items',
  authMiddlware.isLoggedIn,
  restaurantController.getavailableMenuItems,
);

router.get(
  '/restaurant/:restId/category/:catId',
  authMiddlware.isLoggedIn,
  restaurantController.getAvailableItemsByCategory,
);

router.post(
  '/restaurant/:restId/nearBranches',
  authMiddlware.isLoggedIn,
  restaurantController.getNearBranches,
);
module.exports = router;
