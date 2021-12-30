const mongoose = require("mongoose");
const sauceSchema = mongoose.Schema({
  userID: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  like: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  userLiked: { type: [`String <userID>`] },
  userDisliked: { type: [`String <userID>`] },
});

module.exports = mongoose.model("Sauce", sauceSchema);
