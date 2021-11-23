// on importe le package mongoose
const mongoose = require("mongoose");
// on importe le package de validation pour pré-valider les informations avant de les enregistrer
const uniqueValidator = require("mongoose-unique-validator");

// on crée un modèle utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

// on vérifie qu'aucun utilisateur ne peut partager la meme adresse email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);