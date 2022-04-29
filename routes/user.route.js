const { Router } = require('express');
const authMiddlware = require('../middlwares/auth.middlware');
const userController = require('../controllers/user.controller');

const router = Router();

router.post(
  '/user/info',
  authMiddlware.isLoggedIn,
  userController.updateUserInfo,
);

router.post(
  '/user/password',
  authMiddlware.isLoggedIn,
  userController.updateUserPassword,
);

router.post(
  '/user/disable/:id',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  userController.disableUser,
);

router.post(
  '/user/address',
  authMiddlware.isLoggedIn,
  userController.addAddress,
);

router.get('/user', authMiddlware.isLoggedIn, userController.getUserInfo);

router.get(
  '/user/address',
  authMiddlware.isLoggedIn,
  userController.listAddresses,
);
// @todo add route to delete address
router.delete(
  '/user/address/:id',
  authMiddlware.isLoggedIn,
  userController.deleteAddress,
);

router.put(
  '/user/address/:id',
  authMiddlware.isLoggedIn,
  userController.updateAddress,
);
module.exports = router;
