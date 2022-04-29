const { Router } = require('express');
const authMiddlware = require('../middlwares/auth.middlware');
const orderService = require('../services/order.service');

const router = Router();

router.post('/order', authMiddlware.isLoggedIn, orderService.addOrder);

module.exports = router;
