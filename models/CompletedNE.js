const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const completedNESchema = new Schema({

  ID: String,
    
});

const completedNE = mongoose.model('completedNE', completedNESchema);
module.exports = completedNE;