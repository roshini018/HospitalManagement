const mongoose = require('mongoose');
 
const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  qualifications: [{ type: String }],
  experience: { type: Number, default: 0 }, // years
  consultationFee: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  availableDays: [{ type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }],
  availableTimeStart: { type: String, default: '09:00' },
  availableTimeEnd: { type: String, default: '17:00' },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  image: { type: String, default: '' },
}, { timestamps: true });
 
module.exports = mongoose.model('Doctor', doctorSchema);