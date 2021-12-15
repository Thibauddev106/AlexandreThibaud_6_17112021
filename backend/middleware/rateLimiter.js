const rateLimit = require("express-rate-limit");


const limiterLogin = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: "3 essais utiliser, veuillez réessayer plus tard"
});

module.exports = limiterLogin;