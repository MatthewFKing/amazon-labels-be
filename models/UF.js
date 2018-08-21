const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ufNumberSchema = new Schema({

  current: Number,
    
}, { capped: { size: 1024, max: 1000, autoIndexId: true }});

const ufNumber = mongoose.model('ufNumber', ufNumberSchema);
module.exports = ufNumber;