/* eslint-disable no-undef */
const generateTokens = require('../utils/generateToken');
const {
  signUpBodyValidation,
  logInBodyValidation,
} = require('../validationSchemas/authValidation.schema');
const authService = require('../services/auth.service');

const signup = async (req, res) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    try {
      await authService.signup(req);
    } catch (e) {
      return res.status(401).json({ error: true, message: e.message });
    }

    res
      .status(201)
      .json({ error: false, message: 'Account created sucessfully' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'internal server error' });
  }
};

const signin = async (req, res) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    try {
      user = await authService.signin(req);
    } catch (e) {
      return res.status(401).json({ error: true, message: e.message });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: 'Logged in sucessfully',
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
module.exports = {
  signup,
  signin,
};
