const Prescription = require('../models/Prescription.model');
const Doctor = require('../models/Doctor.model');
const notificationService = require('../services/notification.service');

const createPrescription = async (req, res, next) => {
  try {
    const { patientId, appointmentId, diagnosis, medicines, advice, followUpDate } = req.body;

    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: doctor._id,
      appointment: appointmentId,
      diagnosis,
      medicines,
      advice,
      followUpDate,
      recordId: req.body.recordId
    });

    await notificationService.notifyPrescriptionAdded({ patientId, doctorName: doctor.user.name });

    const populated = await Prescription.findById(prescription._id)
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

    res.status(201).json({ success: true, prescription: populated });
  } catch (error) {
    next(error);
  }
};

const getMyPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    next(error);
  }
};

const getDoctorPrescriptions = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate('patient', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    next(error);
  }
};

const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .populate('appointment');

    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });

    // Check access
    const isPatient = prescription.patient._id.toString() === req.user._id.toString();
    const isDoctor = req.user.role === 'doctor';
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPrescription, getMyPrescriptions, getDoctorPrescriptions, getPrescriptionById };