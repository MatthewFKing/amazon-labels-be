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
  techNumber: {type: String},
  qa: {
    blemishSpec: String,
    finalQA: String,
    checkedAt: String,
    checkedInBy: String
  },
  trackingNumber: String,
  pointsValue: String,
  timeCheckedIn: String,
  notes: String,
  fullTest: String,
  isThisMonth: Boolean,
});



qaEntrySchema.statics.findByNumber = function(number) {
  return this.find({ techNumber: number });
}

const qaEntry = mongoose.model('qaEntry', qaEntrySchema);
module.exports = qaEntry;