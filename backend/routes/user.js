// on importe l'application express
const express = require("express");
// on importe le routeur
const router = express.Router();
// on importe le controller user
const userCtrl = require("../controllers/user");
const testEmail = require("../middleware/test-email");
const testPassword = require("../middleware/test-password");
const rateLimit = require("express-rate-limit");

const limiterLogin = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: "3 essais utiliser, veuillez réessayer plus tard"
});
// on met en place les routes d'authentification
router.post("/signup", testEmail, testPassword, userCtrl.signup);
router.post("/login", limiterLogin, userCtrl.login);



module.exports = router;
