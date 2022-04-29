const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
  try {
    if (!req.get('Authorization')) {
      return res.status(401).json({ message: 'You need to login first' });
    }
    let user;
    try {
      user = jwt.verify(
        req.get('Authorization'),
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
      );
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token!' });
    }
    req.user = user;
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
  next();
};

const isAdmin = (req, res, next) => {
  try {
    const { role } = req.user;
    if (!role)
      return res
        .status(401)
        .json({ error: true, message: 'You need to login first' });

    if (role !== 'admin')
      return res.status(401).json({ error: true, message: 'Only Admin' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: 'Something went wrong' });
  }
  next();
};

module.exports = { isLoggedIn, isAdmin };
