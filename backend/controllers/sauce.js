// on importe le modele sauce
const Sauce = require("../models/Sauce");
// on importe le package fs (système de fichier)
const fs = require("fs");

// fonction pour créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // on supprime le faux _id envoyé par le frontend
    delete sauceObject._id;
    // on crée une instance du modele sauce avec toutes les informations
    const sauce = new Sauce({
        ...sauceObject,
        // on complète l'URL de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistré"}))
        .catch(error => res.status(400).json({ error }));
};

// fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    // on crée un objet sauceObject qui regarde si req.file existe ou non
    const sauceObject = req.file ?
    {
        // S'il existe, on traite la nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        // s'il n'existe pas, on traite simplement l'objet entrant
    } : { ...req.body };
    // on met à jour la sauce qui correspond à l'objet du premier argument
    // et on utilise le paramètre id passé dans la demande
    // pour le remplacer par la sauce passé comme second argument
    Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: "Sauce modifié !"}))
        .catch(error => res.status(400).json({ error }));
};

// fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    // on utilise l'ID que nous recevons comme paramètre pour accéder au sauce correspondant dans la base de données
    Sauce.findOne({ _id: req.params.id })
        then(sauce => {
            // on utilise le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
            const filename = sauce.imageUrl.split("/images/")[1];
            // on utilise la fonction unlink du package fs pour supprimer ce fichier, 
            //en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));    
};

// fonction pour obtenir la sauce unique ayant le meme _id que le parametre de la requête et l'envoyer au frontend 
exports.getOneSauce = (req, res, next) => { 
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// fonction pour obtenir toutes les sauces de la base de donnée et l'envoyer au frontend
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};