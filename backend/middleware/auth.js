// on importe le package jsonweb token
const jwt = require("jsonwebtoken");

// on crée le middleware qui vérifie que l'utilisateur est authentifié
module.exports = (req, res, next) => {
    try {
        // on extrait le token de la requête  
        const token = req.headers.authorization.split(" ")[1];
        // on décode notre token
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        // on extrait l'ID utilisateur du token
        const userId = decodedToken.userId;
        // si la demande contient un ID utilisateur, nous le comparons à celui extrait du token
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID non valable !";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | "Requête non authentifié !"})
    }
};