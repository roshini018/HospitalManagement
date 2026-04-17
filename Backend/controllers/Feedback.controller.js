const feedbackService = require("../services/feedback.service");
const Appointment = require("../models/Appointment.model");

const submitFeedback = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;

    if (!doctorId || !rating) {
      return res.status(400).json({ message: "doctorId and rating are required" });
    }

    const feedback = await feedbackService.submitFeedback({
      patientId: req.user._id,
      doctorId,
      appointmentId,
      rating,
      comment,
    });
    
    // Mark appointment as reviewed
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { reviewed: true });
    }

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getDoctorFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.getDoctorFeedback(req.params.id);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.getAllFeedback();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitFeedback, getDoctorFeedback, getAllFeedback };