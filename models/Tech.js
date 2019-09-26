const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const techSchema = new Schema({

  name: String,
  number: String,
    
});

const tech = mongoose.model('tech', techSchema);
module.exports = tech;