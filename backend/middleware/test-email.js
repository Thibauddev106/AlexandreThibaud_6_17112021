module.exports = (req, res, next) => {
    const emailValide = (email) => {
        let emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        let regexValid = emailRegex.test(email)
        regexValid ? next() : res.status(400).json({ message: "email non valide"});
    }
    emailValide(req.body.email)
};