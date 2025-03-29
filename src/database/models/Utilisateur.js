const Mongoose = require('mongoose');

module.exports = Mongoose.model('Utilisateur', new Mongoose.Schema({

    id: { type: String, required: false },
    nom: { type: String, required: false },
    prenom: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    status: { type: Boolean, default: false },
    permissions: { type: Array, default: [] },

}));