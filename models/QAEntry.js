const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qaEntrySchema = new Schema({

  date: { type: Date },
  fbStatus: String,
  orderID: String,
  invoiceNumber: String,
  serial: String,
  model: String,
  sku: String,
  shippingMethod: String,
  mustShip: String,
  techNumber: String,
  qa: {
    blemishSpec: String,
    finalQA: String,
    checkedAt: String,
    checkedInBy: String
  },
  trackingNumber: String,
  pointsValue: Number,
  timeCheckedIn: String,
  notes: String,
  fullTest: String,
  isThisMonth: Boolean,

    
});

const qaEntry = mongoose.model('qaEntry', qaEntrySchema);
module.exports = qaEntry;