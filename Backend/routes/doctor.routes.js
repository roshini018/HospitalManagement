const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, getDoctorProfile, updateDoctorProfile, getDoctorPatients } = require('../controllers/doctor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getAllDoctors);
router.get('/profile', protect, authorize('doctor'), getDoctorProfile);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/patients', protect, authorize('doctor'), getDoctorPatients);
router.get('/:id', getDoctorById);

module.exports = router;