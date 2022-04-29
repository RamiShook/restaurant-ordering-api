const { Router } = require('express');
const authMiddlware = require('../middlwares/auth.middlware');
const restaurantBranchController = require('../controllers/restaurantBranch.controller');

const router = Router();

router.post(
  '/restaurant-branch',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  restaurantBranchController.addRestaurantBranch,
);

router.delete(
  '/restaurant-branch/:id',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  restaurantBranchController.deleteRestaurantBranch,
);

router.put(
  '/restaurant-branch/:id',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  restaurantBranchController.updateRestaurantBranch,
);
router.post(
  '/restaurant-branch/near',
  authMiddlware.isLoggedIn,
  restaurantBranchController.getNearRestaurantBranch,
);

module.exports = router;
