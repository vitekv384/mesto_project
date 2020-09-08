const validator = require('validator');
const { BadRequestError } = require('./bad-request-error');

module.exports = (value) => {
  if (!validator.isURL(value)) {
    throw new BadRequestError();
  } else { return value; }
};
