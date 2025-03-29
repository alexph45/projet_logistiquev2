const Mongoose = require('mongoose');

module.exports = Mongoose.model('Colis', new Mongoose.Schema({

    id: { type: String, required: true },
    poids: { type: Number, required: true },
    statut: { type: String, required: true },
    adresseDestinataire: { type: String, required: true },
    positionSac: { type: String, default: "" }

}));