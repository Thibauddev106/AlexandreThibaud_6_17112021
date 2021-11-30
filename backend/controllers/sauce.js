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
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [""],
        usersDisliked: [""],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistré"}))
        .catch(error => res.status(400).json({ error }));
};

// fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    if(req.file) {
        sauceObject.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        Sauce.findOne({_id: req.params.id}, {imageUrl: true}, (err, sauce) => {
            if(err) {
                console.log(err);
                return;
            }
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(res.status(200).json({ message : "Sauce modifiée"}))
                .catch(error => res.status(400).json({ error }))  
            });
        })
    };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(res.status(200).json({ message : "Sauce modifiée"}))
                .catch(error => res.status(400).json({ error })) 
};
    
    
// fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    // on utilise l'ID que nous recevons comme paramètre pour accéder au sauce correspondant dans la base de données
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
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

// fonction pour les likes et dislike
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    let sauceId = req.params.id;

    switch(like) {
        //si like = 1 l'utilisateur aime la sauce
        case 1 :
            // l'ID de l'utilisateur est ajouté au tableau et incrémenté au nombre total de likes
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
                .then(() => res.status(200).json({ message: "J'aime" }))
                .catch((error) => res.status(400).json({ error }))
        break;

        // si like = 0 l'utilisateur annule son like ou son dislike
        case 0 :
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                    // on vérifie si l'utilisateur a annulé un like, si vrai on désincrémente au nombre total de likes
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                            .then(() => res.status(200).json({ message: "Neutre" }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                    // on vérifie si l'utilisateur a annulé un dislike,si vrai on désincrémente au nombre total de dislikes
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                            .then(() => res.status(200).json({ message: "Neutre" }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                })
                .catch((error) => res.status(404).json({ error }))
        break;

        // si like = -1 l'utilisateur n'aime pas la sauce
        case -1 :
            // l'ID de l'utilisateur est ajouté au tableau et incrémenté au nombre total de dislikes
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: "Je n'aime pas" }) })
            .catch((error) => res.status(400).json({ error }))
            break;

            default:
                console.log(error);
    }
}