// on importe l'application express
const express = require("express");
// on importe le routeur
const router = express.Router();
// on importe le controller user
const userCtrl = require("../controllers/user");
const testEmail = require("../middleware/test-email");
const testPassword = require("../middleware/test-password");
const limiterLogin = require("../middleware/rateLimiter");

// on met en place les routes d'authentification
router.post("/signup", testEmail, testPassword, userCtrl.signup);
router.post("/login", limiterLogin, userCtrl.login);

module.exports = router;
