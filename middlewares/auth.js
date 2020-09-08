const jwt = require('jsonwebtoken');
const NotAutorizedError = require('../errors/not-autorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new NotAutorizedError('Необходима авторизация'));
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new NotAutorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
