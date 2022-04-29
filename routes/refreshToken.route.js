const { Router } = require('express');
const jwt = require('jsonwebtoken');
const UserToken = require('../models/userToken.model');
const {
  refreshTokenBodyValidation,
} = require('../validationSchemas/authValidation.schema');
const verifyRefreshToken = require('../utils/verifyRefreshToken');

const router = Router();

// get new access token
router.post('/', async (req, res) => {
  const { error } = refreshTokenBodyValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, role: tokenDetails.role };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: '14m' },
      );
      res.status(200).json({
        error: false,
        accessToken,
        message: 'Access token created successfully',
      });
    })
    .catch((err) => res.status(400).json(err));
});

// logout
router.delete('/', async (req, res) => {
  try {
    const { error } = refreshTokenBodyValidation(req.get('x-access-token'));
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const userToken = await UserToken.findOne({
      token: req.get('x-access-token'),
    });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: 'Logged Out Sucessfully' });

    await userToken.remove();
    res.status(200).json({ error: false, message: 'Logged Out Sucessfully' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

module.exports = router;
