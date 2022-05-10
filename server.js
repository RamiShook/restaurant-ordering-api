const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');
const refreshTokenRoutes = require('./routes/refreshToken.route');
const userRoutes = require('./routes/user.route');
const menuRoutes = require('./routes/menu.route');
const restaurantBranchRoutes = require('./routes/restaurantBranch.route');
const restaurantRoutes = require('./routes/restaurant.route');
const orderRoutes = require('./routes/order.route');
const testRoutes = require('./routes/test.route');

require('dotenv').config();

function createServer() {
  const corsOptions = {
    origin: '*',
    methods: 'GET, POST, DELETE, PUT',
  };

  const app = express();
  app.use(cors(corsOptions));
  app.use(bodyParser.json());

  app.use('/api', authRoutes);
  app.use('/api/refreshToken', refreshTokenRoutes);
  app.use('/api', userRoutes);
  app.use('/api', menuRoutes);
  app.use('/api', restaurantBranchRoutes);
  app.use('/api', restaurantRoutes);
  app.use('/api', orderRoutes);
  app.use('/api', testRoutes);

  app.use((error, req, res, next) => {
    console.log(error);
    console.log('From Last next, ');
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || 'internal server error' });
  });

  return app;
}
module.exports = { createServer };
