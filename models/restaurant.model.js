const mongoose = require('mongoose');

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  items: {
    type: [Schema.Types.ObjectId],
    ref: 'Item',
  },
  branches: {
    type: [Schema.Types.ObjectId],
    ref: 'RestaurantBranch',
  },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
