const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  tokenNumber: { type: Number },
  queuePosition: { type: Number, default: 0 },

  // ✅ Single source of truth — lowercase DB values only.
  // The frontend normalizes display labels; the controller maps
  // any legacy / UI values before saving.
  status: {
    type: String,
    enum: ['scheduled', 'waiting', 'active', 'completed', 'skipped', 'cancelled', 'missed'],
    default: 'scheduled',
  },

  reviewed: { type: Boolean, default: false },
  symptoms: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

