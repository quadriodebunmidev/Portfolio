const mongoose = require('mongoose');
const expSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String },
  achievements: [{ type: String }],
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  techUsed: [{ type: String }]
});
module.exports = mongoose.model('Experience', expSchema);
