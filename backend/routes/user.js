// on importe l'application express
const express = require("express");
// on importe le routeur
const router = express.Router();
// on importe le controller user
const userCtrl = require("../controllers/user");

// on met en place les routes d'authentification
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
