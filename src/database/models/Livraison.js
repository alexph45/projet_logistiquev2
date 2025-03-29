const Mongoose = require('mongoose');

module.exports = Mongoose.model('Livraison', new Mongoose.Schema({

    id: { type: String, required: true },
    camion: { type: String, required: true },
    colis: { type: Array, default: [] },
    livreur: { type: String, required: false },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    status: { type: String, default: "inactive" },
    
}));