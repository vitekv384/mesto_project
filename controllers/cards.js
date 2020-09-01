/* eslint-disable consistent-return */
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка валидации ${err.message}` });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.id })
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: `Карточка с id ${req.params.id} не найдена` });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Ошибка валидации id карточки ${req.params.id}` });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Ошибка валидации id карточки ${req.params.id}` });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: `Карточка с id ${req.params.id} не найдена` });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Ошибка валидации id карточки ${req.params.id}` });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: `Карточка с id ${req.params.id} не найдена` });
      }
      res.status(500).send({ message: err.message });
    });
};
