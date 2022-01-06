const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodeToken.userID;
    // req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Identifiant Utilisateur Non-Valide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error("La requête est invalide") });
  }
};
