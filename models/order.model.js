const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    branch: {
      type: Schema.Types.ObjectId,
      ref: 'RestaurantBranch',
      required: true,
    },

    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, default: 1, required: true },
      },
    ],

    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    address: { type: Schema.Types.ObjectId, ref: 'Address', required: true },

    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('Order', orderSchema);
