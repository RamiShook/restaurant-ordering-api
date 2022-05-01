const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    branch: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      address: {
        coordinates: {
          type: [Number],
          index: '2dsphere',
        },
      },
    },

    items: [
      {
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, default: 1, required: true },
      },
    ],

    user: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
    },

    address: {
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },

      completeAddress: {
        street: { type: String },
        city: { type: String },
        building: { type: String },
      },
    },

    restaurant: {
      id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
      name: { type: String, required: true },
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
