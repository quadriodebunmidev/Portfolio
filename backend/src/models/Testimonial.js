const mongoose = require('mongoose');
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String },
  quote: { type: String, required: true },
  avatarUrl: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Testimonial', testimonialSchema);
