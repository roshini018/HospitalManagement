require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthsync');
    console.log('Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Doctor.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin User', email: 'admin@healthsync.com',
      password: 'admin123', role: 'admin', phone: '9999999999'
    });
    console.log('✅ Admin created: admin@healthsync.com / admin123');

    // Create doctors
    const doctorsData = [
      { name: 'Dr. Priya Sharma', email: 'priya@healthsync.com', specialization: 'Cardiologist', experience: 12, consultationFee: 800, availableDays: ['Mon','Tue','Wed','Thu','Fri'] },
      { name: 'Dr. Arjun Mehta', email: 'arjun@healthsync.com', specialization: 'Neurologist', experience: 8, consultationFee: 700, availableDays: ['Mon','Wed','Fri'] },
      { name: 'Dr. Sneha Reddy', email: 'sneha@healthsync.com', specialization: 'Pediatrician', experience: 6, consultationFee: 500, availableDays: ['Tue','Thu','Sat'] },
      { name: 'Dr. Vikram Nair', email: 'vikram@healthsync.com', specialization: 'Orthopedic', experience: 15, consultationFee: 900, availableDays: ['Mon','Tue','Thu','Fri'] },
    ];

    for (const d of doctorsData) {
      const user = await User.create({ name: d.name, email: d.email, password: 'doctor123', role: 'doctor', phone: '9876543210' });
      await Doctor.create({ user: user._id, specialization: d.specialization, experience: d.experience, consultationFee: d.consultationFee, availableDays: d.availableDays, isAvailable: true });
      console.log(`✅ Doctor created: ${d.email} / doctor123`);
    }

    // Create patients
    const patientsData = [
      { name: 'Rahul Kumar', email: 'rahul@example.com' },
      { name: 'Anita Singh', email: 'anita@example.com' },
    ];

    for (const p of patientsData) {
      await User.create({ name: p.name, email: p.email, password: 'patient123', role: 'patient', phone: '9123456789' });
      console.log(`✅ Patient created: ${p.email} / patient123`);
    }

    console.log('\n🎉 Seed completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();