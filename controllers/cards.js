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
    .catch((err) => ((err.name === 'ValidationError') ? res.status(400).send({ message: 'Неверный формат данных карточки' }) : res.status(500).send({ message: err.message })));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card !== null) {
        if (card.owner.toString() !== req.user._id) {
          return res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
        }
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: 'Нет карточки для удаления' });
      }
    })
    .catch((err) => ((err.name === 'CastError') ? res.status(400).send({ message: 'Неверный формат id карточки' }) : res.status(500).send({ message: err.message })));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error(`Карточка с _id ${req.params.id} не найдена`))
    .then((card) => res.send({ data: card }))
    .catch((err) => ((err.name === 'CastError') ? res.status(400).send({ message: 'Неверный формат id карточки' }) : res.status(404).send({ message: err.message })));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error(`Карточка с _id ${req.params.id} не найдена`))
    .then((card) => res.send({ data: card }))
    .catch((err) => ((err.name === 'CastError') ? res.status(400).send({ message: 'Неверный формат id карточки' }) : res.status(404).send({ message: err.message })));
};
