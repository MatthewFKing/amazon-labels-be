const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const completedOrdersSchema = new Schema({

  ID: String,
  type: String
    
});

const completedOrders = mongoose.model('completedOrders', completedOrdersSchema);
module.exports = completedOrders;