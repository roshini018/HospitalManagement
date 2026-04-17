const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  currentToken: { type: Number, default: 0 },
  nextToken: { type: Number, default: 1 },
  isActive: { type: Boolean, default: false },
  avgConsultationTime: { type: Number, default: 10 }, // minutes
  entries: [{
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tokenNumber: { type: Number },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed', 'skipped'],
      default: 'waiting'
    },
    checkedInAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
  }]
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);