// on importe l'application express
const express = require("express");
// on importe le package mongoose
const mongoose = require("mongoose");
// on importe path
const path = require("path");
// on importe le routeur sauce
const sauceRoutes = require("./routes/sauce");
// on importe le routeur utilisateur
const userRoutes = require("./routes/user");
const app = express();
require("dotenv").config();
const helmet = require("helmet");


// connection à mongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.SECRET_ADMIN_DB}:${process.env.SECRET_PASSWORD_DB}@cluster0.ltnwj.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


app.use(helmet());

//  middleware pour éviter les erreurs de securité CORS
app.use((req, res, next) => {
  
    // on accède a l'API depuis n'importe quel origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // on ajoute ces headers aux requete envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // on permet d'envoyé des requetes avec ces méthode
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  // on ajoute le gestionnaire de routage pour indiquer à express qu'il faut gérer la ressource images 
  //de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) 
  //à chaque fois qu'elle reçoit une requête vers la route /images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
