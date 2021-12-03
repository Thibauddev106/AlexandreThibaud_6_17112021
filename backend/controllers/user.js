// on importe le package bcrypt
const bcrypt = require("bcrypt");
// on importe jsonwebtoken
const jwt = require("jsonwebtoken");
// on importe le modele utilisateur
const User = require("../models/user");
require("dotenv").config();

// 
exports.signup = (req, res, next) => {
    // bcrypt hash le mot de passe et le sale 10 fois
    bcrypt.hash(req.body.password, 10)
        // on crée un utilisateur 
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // et on l'enregistre dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
                .catch(error => res.status(400).json({ error}))
        })
        .catch(error => res.status(500).json({ error }));
};

// vérification si un utilisateur qui tente de se connecter dispose d'identifiant valide
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        // on vérifie que l'email entré correspond à un email existant de la base de données
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non touvé !" });
            }
            // bcrypt compare le mot de passe entré avec le hash enregistré dans la base de donnée
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    // si tout est valide, on renvoie une réponse 200 contenant l'ID utilisateur et un token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.SECRET_TOKEN,
                            { expiresIn: "24h"}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error}));
        })
        .catch(error => res.status(500).json({ error}))
};