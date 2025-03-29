const Mongoose = require('mongoose');

module.exports = Mongoose.model('Sac', new Mongoose.Schema({

    id: { type: String, required: false },
    label: { type: String, required: true }

}));