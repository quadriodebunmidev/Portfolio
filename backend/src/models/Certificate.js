const mongoose = require('mongoose');
const certSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String, required: true },
  credentialUrl: { type: String },
  imageUrl: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Certificate', certSchema);
