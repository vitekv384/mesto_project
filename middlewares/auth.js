const jwt = require('jsonwebtoken');
const key = require('../key');
const NotAutorizedError = require('../errors/not-autorized-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new NotAutorizedError('Необходима авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new NotAutorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
