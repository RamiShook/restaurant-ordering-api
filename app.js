const mongoose = require('mongoose');

const { createServer } = require('./utils/server');

const app = createServer();

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
