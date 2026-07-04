const mongoose = require('mongoose');
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['frontend', 'backend', 'database', 'tools', 'other'], default: 'other' },
  proficiency: { type: Number, min: 1, max: 100, default: 80 },
  icon: { type: String },
  color: { type: String, default: '#ffffff' }
});
module.exports = mongoose.model('Skill', skillSchema);
