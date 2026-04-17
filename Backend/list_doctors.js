const mongoose = require('mongoose');
const Doctor = require('./models/Doctor.model');
const User = require('./models/User.model');

mongoose.connect('mongodb://localhost:27017/cHospital')
  .then(async () => {
    const doctors = await Doctor.find().populate('user');
    doctors.forEach(d => {
      console.log(`Doctor ID: ${d._id}, Name: ${d.user?.name}, Specialization: ${d.specialization}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
