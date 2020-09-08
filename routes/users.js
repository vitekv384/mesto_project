const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidation = require('../errors/url-validation');
const {
  getUsers, getUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value) => urlValidation(value)),
  }),
}), updateUserAvatar);

module.exports = usersRouter;
