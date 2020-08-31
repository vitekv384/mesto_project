const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../key');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.id).orFail(() => new Error(`Пользователь с _id ${req.params.id} не найден`))
    .then((user) => res.send({ data: user }))
    .catch((err) => ((err.name === 'CastError') ? res.status(400).send({ message: 'Неверный формат id пользователя' }) : res.status(404).send({ message: err.message })));
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) {
    return res.status(400).send({ message: 'Формат пароля неверен' });
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: 'Неверный формат данных пользователя' }) : res.status(409).send({ message: err.message })));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail(() => new Error(`Пользователь с _id ${req.user._id} не найдена`))
    .then((user) => res.send({ data: user }))
    .catch((err) => ((err.name === 'CastError' || err.name === 'ValidationError') ? res.status(400).send({ message: 'Неверный формат id или данных пользователя' }) : res.status(404).send({ message: err.message })));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => ((err.name === 'CastError' || err.name === 'ValidationError') ? res.status(400).send({ message: 'Неверный формат id или ссылки на avatar пользователя' }) : res.status(404).send({ message: err.message })));
};
