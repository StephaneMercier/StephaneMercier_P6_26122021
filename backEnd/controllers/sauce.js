const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject.id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json("Sauce created !"))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
  console.log(Sauce.imageUrl);
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: "Sauce modified successfully !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: "Sauce deleted succesfully !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.likeDislike = (req, res, next) => {
  const user = req.body.userId;
  const isLike = req.body.like;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // Création de l'objet des valeurs qui vont être modifiées au clic
      let likeValue = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
      };
      // Utilisation de switch() pour prendre en compte les différents cas de figure
      switch (isLike) {
        // Si like === 1
        case 1:
          likeValue.usersLiked.push(user);
          break;
        // Si like === -1
        case -1:
          likeValue.usersDisliked.push(user);
          break;
        // Si like === 0
        case 0:
          // si on annule le like il faut retirer l'user du tableau usersLiked
          if (likeValue.usersLiked.includes(user)) {
            const likeIndex = likeValue.usersLiked.indexOf(user);
            likeValue.usersLiked.splice(likeIndex, 1);
          } else {
            // Idem mais pour le tableau usersDisliked
            const dislikeIndex = likeValue.usersDisliked.indexOf(user);
            likeValue.usersDisliked.splice(dislikeIndex, 1);
          }
          break;
      }
      // Update des like/disliked

      // Assignation de constante pour avoir le résultat du tableau usersLiked ou usersDisliked
      likeValue.likes = likeValue.usersLiked.length;
      likeValue.dislikes = likeValue.usersDisliked.length;
      console.log("likeValue : ", likeValue);
      // MàJ de la sauce avec les valeurs retournées
      Sauce.updateOne({ _id: sauceId }, likeValue)
        .then(() => res.status(200).json({ message: "Your opinion is noted" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
