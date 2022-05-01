const { Router } = require('express');
const authMiddlware = require('../middlwares/auth.middlware');
const orderController = require('../controllers/order.controller');

const router = Router();

router.post('/order', authMiddlware.isLoggedIn, orderController.addOrder);

router.get('/order', authMiddlware.isLoggedIn, orderController.listOrders);

router.put(
  '/order/:id/cancel',
  authMiddlware.isLoggedIn,
  orderController.cancelOrder,
);

router.get(
  '/order/:id',
  authMiddlware.isLoggedIn,
  orderController.getOrderInfo,
);

module.exports = router;
