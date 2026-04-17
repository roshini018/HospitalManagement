const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const Appointment = require('../models/Appointment.model');
const Queue = require('../models/Queue.model');

const getStats = async (req, res, next) => {
  try {
    const [totalPatients, totalDoctors, totalAppointments, todayAppointments] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({
        date: { $gte: new Date().setHours(0,0,0,0), $lte: new Date().setHours(23,59,59,999) }
      })
    ]);

    const completedToday = await Appointment.countDocuments({
      status: 'completed',
      date: { $gte: new Date().setHours(0,0,0,0), $lte: new Date().setHours(23,59,59,999) }
    });

    res.json({ success: true, stats: { totalPatients, totalDoctors, totalAppointments, todayAppointments, completedToday } });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email phone isActive').sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    next(error);
  }
};

const addDoctor = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialization, qualifications, experience, consultationFee } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = await User.create({ name, email, password, role: 'doctor', phone });
    const doctor = await Doctor.create({ user: user._id, specialization, qualifications, experience, consultationFee });

    const populated = await Doctor.findById(doctor._id).populate('user', 'name email phone');
    res.status(201).json({ success: true, doctor: populated });
  } catch (error) {
    next(error);
  }
};

const addPatient = async (req, res, next) => {
  try {
    const { name, email, password, phone, age, bloodGroup, medicalCondition } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      age,
      bloodGroup,
      medicalCondition,
      role: 'patient'
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'doctor') await Doctor.findOneAndDelete({ user: req.params.id });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    await User.findByIdAndDelete(doctor.user);
    res.json({ success: true, message: 'Doctor and user deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, getAllDoctors, addDoctor, addPatient, toggleUserStatus, deleteUser, deleteDoctor };