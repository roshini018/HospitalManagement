const mongoose = require('mongoose');
require('dotenv').config();
const Appointment = require('./models/Appointment.model');
const Doctor = require('./models/Doctor.model');
const User = require('./models/User.model');

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chospital").then(async () => {
    const appts = await Appointment.find().populate('doctor patient').sort({createdAt: -1}).limit(10);
    console.log(JSON.stringify(appts.map(a => ({
        id: a._id.toString(),
        patientName: a.patient?.name,
        doctorName: a.doctor?.user?.toString(), // just checking
        date: a.date,
        symptoms: a.symptoms,
        timeSlot: a.timeSlot,
        status: a.status
    })), null, 2));
    process.exit(0);
});
