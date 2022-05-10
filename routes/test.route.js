const { Router } = require('express');
const testController = require('../controllers/test.controller');

const router = Router();

router.post('/test-error', testController.testError);

module.exports = router;
