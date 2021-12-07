const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
// doit avoir minimum 8 caractères
.is().min(8)
// doit avoir maximum 100 caractères
.is().max(100)
// doit avoir majuscule
.has().uppercase()
// doit avoir minuscule
.has().lowercase()
// doit avoir 1 chiffre
.has().digits()
// ne pas avoir d'espaces
.has().not().spaces()

module.exports = passwordSchema;