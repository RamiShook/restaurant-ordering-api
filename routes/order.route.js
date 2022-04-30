const { Router } = require('express');
const authMiddlware = require('../middlwares/auth.middlware');
const orderController = require('../controllers/order.controller');

const router = Router();

router.post('/order', authMiddlware.isLoggedIn, orderController.addOrder);

module.exports = router;
