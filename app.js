const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.route');
const refreshTokenRoutes = require('./routes/refreshToken.route');
const userRoutes = require('./routes/user.route');
const menuRoutes = require('./routes/menu.route');
const restaurantBranchRoutes = require('./routes/restaurantBranch.route');
const restaurantRoutes = require('./routes/restaurant.route');
const orderRoutes = require('./routes/order.route');

require('dotenv').config();

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

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3002, () => {
      console.log(
        `Mongo Connected!, \nApp works on ${process.env.PORT || 3002}`,
      );
    });
  })
  .catch((err) => console.log(err));
