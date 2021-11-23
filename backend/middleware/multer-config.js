// on importe le package multer
const multer = require("multer");

// on crée la constante dictionnaire de type MIME 
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
}

// on crée une constante storage, à passer à multer comme configuration
const storage = multer.diskStorage({
    // la fct destination indique à multer d'enregistrer les fichiers dans le dossier images
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    // la fct filname indique à multer : ,  
    filename: (req, file, callback) => {
        // d'utiliser le nom d'origine et de remplacer les espaces par des underscores
        const name = file.originalname.split(" ").join("_");
        // Elle utilise ensuite la constante de type MIME pour résoudre l'extension de fichier appropriée ;
        const extension = MIME_TYPES[file.mimetype];
        // et d'ajouter un timestamp Date.now() comme nom de fichier
        callback(null, name + Date.now() + "." + extension);
    } 
});

module.exports = multer({ storage: storage }).single("image");