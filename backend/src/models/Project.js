const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  techStack: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  imageUrl: { type: String },
  featured: { type: Boolean, default: false },
  category: { type: String, enum: ['fullstack', 'frontend', 'backend', 'api', 'other'], default: 'fullstack' },
  status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Project', projectSchema);
