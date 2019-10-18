const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const techSchema = new Schema({

  name: String,
  number: String,
  active: Boolean,
  team: {
    type: String,
    enum: ['A1', 'A2', 'B']
  },
    
});

const tech = mongoose.model('tech', techSchema);
module.exports = tech;