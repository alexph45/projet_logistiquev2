const Mongoose = require('mongoose');

module.exports = Mongoose.model('Camion', new Mongoose.Schema({

    id: { type: String, required: false },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    immatriculation: { type: String, required: true },
    poids: { type: Number, required: true }
    
}));