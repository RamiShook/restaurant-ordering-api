const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const Address = require('../models/address.model');

const findById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const userAction = async (id, disable) => {
  try {
    const user = await findById(id);
    if (!user) return Promise.reject(Error('user not found'));

    if (user.role === 'admin')
      return Promise.reject(Error('Cannot diasble Admin account'));

    await User.findByIdAndUpdate(id, { $set: { disabled: disable } });
  } catch (err) {
    return Promise.reject(err);
  }
};

const checkPassword = async (plainPassword, hashedPassword) => {
  const isValidPassword = await bcrypt.compare(plainPassword, hashedPassword);

  return isValidPassword;
};

const updateUserInfo = async (userId, info) => {
  try {
    const user = await User.findById(userId);
    if (!(await checkPassword(info.password, user.password)))
      return Promise.reject(Error('Password incorrect'));

    const { password, ...userInfo } = info;

    const updateUser = await User.findByIdAndUpdate(userId, userInfo);
    return updateUser;
  } catch (err) {
    return Promise.reject(err);
  }
};

const updateUserPassword = async (userId, reqBody) => {
  try {
    const user = await User.findById(userId);
    if (!(await checkPassword(reqBody.oldPassword, user.password)))
      return Promise.reject(Error('Password incorrect'));

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(reqBody.newPassword, salt);

    const updateUser = await User.findByIdAndUpdate(userId, {
      password: hashPassword,
    });

    return updateUser;
  } catch (err) {
    return Promise.reject(err);
  }
};

const addAddress = async (userId, address) => {
  try {
    // eslint-disable-next-line no-param-reassign
    address.user = userId;
    const userAddress = await Address.create(address);

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { address: userAddress._id },
      },
      { returnOriginal: false },
    );

    return userAddress;
  } catch (err) {
    return Promise.reject(err);
  }
};

const getUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId, {
      email: 1,
      fullName: 1,
    }).populate('address', '-user -__v');

    return user;
  } catch (err) {
    return Promise.reject(err);
  }
};

const listAddresses = async (userId) => {
  try {
    const user = await User.findById(userId, { address: 1 }).populate(
      'address',
      '-user -__v',
    );

    return user;
  } catch (err) {
    return Promise.reject(err);
  }
};

const deleteAddress = async (userId, addressId) => {
  try {
    const userAddresses = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { address: addressId },
      },

      { fields: { address: 1 }, returnOriginal: false },
    );

    await Address.findOneAndDelete({ _id: addressId, user: userId });

    return userAddresses;
  } catch (err) {
    return Promise.reject(err);
  }
};

const existUserAddressId = async (userId, addressId) => {
  try {
    const userAddress = await User.findOne({
      _id: userId,
      address: { $in: addressId },
    });

    return userAddress;
  } catch (err) {
    return Promise.reject(err);
  }
};

const updateAddress = async (addressId, addressInfo) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      addressInfo,
      { returnOriginal: false },
    );

    if (!updatedAddress) return Promise.reject(Error('address not updated'));

    return updatedAddress;
  } catch (err) {
    return Promise.reject(err);
  }
};

const getAddressInfo = async (addressId) => {
  try {
    const address = await Address.findById(addressId);
    return address;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  findById,
  userAction,
  updateUserInfo,
  updateUserPassword,
  addAddress,
  getUserInfo,
  listAddresses,
  deleteAddress,
  existUserAddressId,
  updateAddress,
  getAddressInfo,
};
