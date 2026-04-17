const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  skipAppointment,
  deleteAppointment,
} = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/all', protect, authorize('admin'), getAllAppointments);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/status', protect, authorize('admin', 'doctor'), updateAppointmentStatus);
router.put('/:id/skip', protect, skipAppointment);
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

module.exports = router;