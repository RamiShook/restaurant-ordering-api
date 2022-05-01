const userService = require('../services/user.service');
const userValidation = require('../validationSchemas/userValidationSchema');
const { Types } = require('mongoose');

const userAction = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong user id' });

    const { disable } = req.body;

    if (typeof disable !== 'boolean')
      return res
        .status(422)
        .json({ error: true, message: 'please set disable to true or false' });

    await userService.userAction(req.params.id, disable);
  } catch (e) {
    console.log(e);
    return res.status(422).json({ error: true, message: e.message });
  }

  return res.status(200).json({
    error: false,
    message: `user ${req.body.disable ? 'disabled' : 'enabled'}`,
  });
};

const updateUserInfo = async (req, res) => {
  const { error } = userValidation.updateUserInfoValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });

  try {
    await userService.updateUserInfo(req.user._id, req.body);
    return res.status(200).json({ error: false, message: 'User info updated' });
  } catch (e) {
    return res.status(422).json({ error: true, message: e.message });
  }
};

const updateUserPassword = async (req, res) => {
  const { error } = userValidation.updateUserPasswordValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });
  try {
    await userService.updateUserPassword(req.user._id, req.body);
    return res
      .status(200)
      .json({ error: false, message: 'User passsword updated' });
  } catch (e) {
    return res.status(422).json({ error: true, message: e.message });
  }
};

const addAddress = async (req, res) => {
  try {
    try {
      const userAddress = await userService.addAddress(req.user._id, req.body);
      return res.status(200).json({ error: false, userAddress });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (e) {
    res.status(500).json({ error: true, message: 'internal server error' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userService.getUserInfo(userId);
    return res.status(200).json({ error: false, user });
  } catch (e) {
    res.status(500).json({ error: true, message: 'internal server error' });
  }
};

const listAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await userService.listAddresses(userId);
    return res.status(200).json({ error: false, addresses });
  } catch (e) {
    res.status(500).json({ error: true, message: 'internal server error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong address id' });

    const userId = req.user._id;

    const userAddress = await userService.existUserAddressId(
      userId,
      req.params.id,
    );

    if (!userAddress)
      return res
        .status(422)
        .json({ error: true, message: 'address not found' });

    const address = await userService.deleteAddress(userId, req.params.id);

    return res.status(200).json({ error: false, address });
  } catch (e) {
    res.status(500).json({ error: true, message: 'internal server error' });
  }
};

const updateAddress = async (req, res) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong address id' });

    const { error } = userValidation.updateUserAddressValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    const existUserAddressId = await userService.existUserAddressId(
      req.user._id,
      req.params.id,
    );
    if (!existUserAddressId)
      return res
        .status(422)
        .json({ error: true, message: 'address not found' });

    addressInfo = req.body;

    try {
      const updatedAddress = await userService.updateAddress(
        req.params.id,
        addressInfo,
      );
      return res.status(200).json({ error: false, updatedAddress });
    } catch (err) {
      return res.status(422).json({ error: true, message: err.message });
    }
  } catch (e) {
    res.status(500).json({ error: true, message: 'internal server error' });
  }
};
module.exports = {
  userAction,
  updateUserPassword,
  addAddress,
  updateUserInfo,
  getUserInfo,
  listAddresses,
  deleteAddress,
  updateAddress,
};
