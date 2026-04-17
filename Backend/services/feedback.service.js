const Feedback = require("../models/Feedback.model");
const Appointment = require("../models/Appointment.model"); // your existing model

// Submit feedback after a completed appointment
const submitFeedback = async ({ patientId, doctorId, appointmentId, rating, comment }) => {
  // Verify appointment exists and is completed
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status !== "completed") throw new Error("Appointment is not completed yet");
  if (appointment.patient.toString() !== patientId.toString())
    throw new Error("Not your appointment");

  // Check for duplicate feedback
  const existing = await Feedback.findOne({ appointment: appointmentId });
  if (existing) throw new Error("Feedback already submitted for this appointment");

  const feedback = await Feedback.create({
    patient: patientId,
    doctor: doctorId,
    appointment: appointmentId,
    rating,
    comment,
  });

  return feedback;
};

// Get all feedback for a specific doctor
const getDoctorFeedback = async (doctorId) => {
  return await Feedback.find({ doctor: doctorId })
    .populate("patient", "name email")
    .populate("appointment", "date")
    .sort({ createdAt: -1 });
};

// Get all feedback (admin)
const getAllFeedback = async () => {
  return await Feedback.find()
    .populate("patient", "name email")
    .populate({ path: "doctor", populate: { path: "user", select: "name" } })
    .populate("appointment", "date")
    .sort({ createdAt: -1 });
};

module.exports = { submitFeedback, getDoctorFeedback, getAllFeedback };