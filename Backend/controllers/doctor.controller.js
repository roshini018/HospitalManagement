const Doctor = require('../models/Doctor.model');
const User = require('../models/User.model');

const getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, search } = req.query;
    let query = {};

    // const doctors = await Doctor.find(query)
    //   .populate('user', 'name email phone avatar isActive')
    //   .lean();
const doctors = await Doctor.find()
  .populate("user", "name email phone avatar isActive");
    let filtered = doctors.filter(d => d.user && d.user.isActive);

    if (specialization) {
      filtered = filtered.filter(d => d.specialization.toLowerCase().includes(specialization.toLowerCase()));
    }
    if (search) {
      filtered = filtered.filter(d =>
        d.user.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ success: true, doctors: filtered });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone avatar');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

const getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

const updateDoctorProfile = async (req, res, next) => {
  try {
    const { 
      name, // Add name for User update
      specialization, 
      qualifications, 
      experience, 
      consultationFee, 
      bio, 
      availableDays, 
      availableTimeStart, 
      availableTimeEnd 
    } = req.body;

    // Update User name if provided
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { specialization, qualifications, experience, consultationFee, bio, availableDays, availableTimeStart, availableTimeEnd },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone avatar isActive');

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

const getDoctorPatients = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment.model');
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone avatar')
      .sort({ date: -1 });

    // Unique patients
    const patientMap = {};
    appointments.forEach(a => {
      if (a.patient && !patientMap[a.patient._id]) {
        patientMap[a.patient._id] = { ...a.patient.toObject(), lastVisit: a.date, totalVisits: 0 };
      }
      if (a.patient) patientMap[a.patient._id].totalVisits++;
    });

    res.json({ success: true, patients: Object.values(patientMap) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDoctors, getDoctorById, getDoctorProfile, updateDoctorProfile, getDoctorPatients };