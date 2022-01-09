const express = require("express");
const app = express();

const mongoose = require("mongoose");
const sauceRoute = require("./routes/sauce");
const userRoute = require("./routes/user");
const path = require("path");
const helmet = require("helmet");
let fs = require("fs");

// Utilisation de ".env" pour créer des variables d'environnement qui seront sécurisées
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connecté à MongoDB !"))
  .catch(() => console.log("connexion échouée !"));

app.use(helmet());
// Autorisation d'accès depuis n'importe quelle adresse IP
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

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoute);
app.use("/api/auth", userRoute);

module.exports = app;
