const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qaEntrySchema = new Schema({

  date: { type: Date },
  fb_status: String,
  order_id: String,
  invoice_number: String,
  serial: String,
  model: String,
  sku: String,
  shipping_method: String,
  must_ship: String,
  tech_number: {type: String},
  qa: {
    blemish_spec: String,
    final_qa: String,
    checked_at: String,
    checked_in_by: String
  },
  tracking_number: String,
  points_value: String,
  time_checked_in: String,
  notes: String,
  full_test: String,
  this_month: Boolean,
  fulfillment_type: String,
});

//Add FBA or Prod field

qaEntrySchema.statics.findByNumber = function(number) {
  return this.find({ tech_number: number });
}

const qaEntry = mongoose.model('qaEntry', qaEntrySchema);
module.exports = qaEntry;