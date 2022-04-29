const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema({
  address: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },

  label: {
    type: String,
  },

  completeAddress: {
    street: { type: String },
    city: { type: String },
    building: { type: String },
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});
module.exports = mongoose.model('Address', addressSchema);
