const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  diagnosis: { type: String, required: true },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String },
    duration: { type: String },
    instructions: { type: String },
  }],
  advice: { type: String, default: '' },
  followUpDate: { type: Date },
  isActive: { type: Boolean, default: true },
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthRecord' },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);