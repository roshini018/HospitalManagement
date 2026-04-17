const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['lab-report', 'prescription', 'imaging', 'discharge-summary', 'other'],
    default: 'other'
  },
  fileName: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },
  filePath: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', recordSchema);