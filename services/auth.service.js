const User = require('../models/user.model');

const bcrypt = require('bcrypt');

const signup = async (req) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return Promise.reject(Error('User with given email already exist'));

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
  } catch (err) {
    return Promise.reject(err);
  }
};

const signin = async (req) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return Promise.reject(Error('Wrong email or password'));

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!verifiedPassword)
      return Promise.reject(Error('Wrong email or password'));

    if (user.disabled) return Promise.reject(Error('User disabled by Admin'));

    return user;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = { signup, signin };
