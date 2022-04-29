const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  address: {
    type: [Schema.Types.ObjectId],
    ref: 'Address',
  },
});

module.exports = mongoose.model('User', userSchema);
