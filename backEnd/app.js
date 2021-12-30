const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

mongoose
  .connect(
    "mongodb+srv://Scrantonicity:Louboutin1@cluster0.qyu0r.mongodb.net/TheHottestReviews?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("connexion à MongoDB réussie !"))
  .catch(() => console.log("connexion échouée !"));

const app = express();
app.use(bodyParser.json());

const sauceRoute = require("./routes/sauce");
const userRoute = require("./routes/user");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoute);
app.use("/api/auth", userRoute);

module.exports = app;
