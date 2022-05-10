const testService = require('../services/test.service');

const testError = async (req, res, next) => {
  try {
    if (!req.body.action) {
      const error = new Error();
      error.message = 'Please make sure you have action in your body!';
      error.statusCode = 400;
      throw error;
    }
    const any = await testService.testError(req.body.action);
    return res.status(200).json({ message: any });
  } catch (err) {
    next(err, res);
  }
};

module.exports = { testError };
