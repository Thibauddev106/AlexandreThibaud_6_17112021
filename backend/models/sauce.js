// on importe le package mongoose
const mongoose = require("mongoose");

// on crée un schéma de données avec les champs souhaités pour chaque sauce
const sauceSchema = mongoose.Schema({
    userId:{type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]},
});

// on exporte le schéma pour le rendre disponible par express
module.exports = mongoose.model("Sauce", sauceSchema);
