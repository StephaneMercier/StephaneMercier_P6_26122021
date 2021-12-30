const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, "myToken_secret");
    const userId = decodeToken.userID;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Identifiant Utilisateur Non-Valide";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Err("La requête est invalide") });
  }
};
