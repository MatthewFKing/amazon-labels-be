const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const npuSchema = new Schema({

  date: { type: Date },
  email_address: String,
  invoice_number: String,
  brand: String,
  sku: String,
  serial_number: String,
  cpu: String,
  gpu: String,
  ram: String,
  hdd: String,
  odd: String,
  screen_resolution: String,
  os: String,
  new: String,
  damage_desc: String,
  damage_loc: String,
  missing_packaging: String,
  functional: String,
  tech_caused: String,
  cpar_level: String,
  qa_approval: String,
  notes: String,
  unit_cost: String,
  tech_number: String,
  tech_name: String,
  team: String,
});

//Add FBA or Prod field

const npuEntry = mongoose.model('npuEntry', npuSchema);
module.exports = npuEntry;