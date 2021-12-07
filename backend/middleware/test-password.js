const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: "Le mot de passe doit faire 8 caractères au moins, avec une majuscule,une minuscule et un chiffre au moins."});
    } else { 
        next();
    }
};