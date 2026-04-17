const Notification = require('../models/Notification.model');

const createNotification = async ({ userId, title, message, type = 'system', link = '' }) => {
  try {
    const notification = await Notification.create({ user: userId, title, message, type, link });
    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error.message);
  }
};

const notifyAppointmentBooked = async ({ patientId, doctorUserId, adminId, patientName, doctorName, date, timeSlot }) => {
  const promises = [
    createNotification({
      userId: patientId,
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${doctorName} on ${new Date(date).toDateString()} at ${timeSlot} is confirmed.`,
      type: 'appointment',
      link: '/appointments'
    }),
    createNotification({
      userId: doctorUserId,
      title: 'New Appointment',
      message: `${patientName} has booked an appointment on ${new Date(date).toDateString()} at ${timeSlot}.`,
      type: 'appointment',
      link: '/doctor/queue'
    })
  ];
  if (adminId) {
    promises.push(createNotification({
      userId: adminId,
      title: 'New Appointment Booked',
      message: `${patientName} booked an appointment with Dr. ${doctorName}.`,
      type: 'appointment',
      link: '/admin/appointments'
    }));
  }
  await Promise.all(promises);
};

const notifyQueueUpdate = async ({ patientId, tokenNumber, currentToken, position }) => {
  await createNotification({
    userId: patientId,
    title: 'Queue Update',
    message: `Current token: ${currentToken}. Your token: ${tokenNumber}. Position: ${position} ahead.`,
    type: 'queue',
    link: '/queue-status'
  });
};

const notifyPrescriptionAdded = async ({ patientId, doctorName }) => {
  await createNotification({
    userId: patientId,
    title: 'Prescription Added',
    message: `Dr. ${doctorName} has added a new prescription for you.`,
    type: 'prescription',
    link: '/prescriptions'
  });
};

module.exports = { createNotification, notifyAppointmentBooked, notifyQueueUpdate, notifyPrescriptionAdded };