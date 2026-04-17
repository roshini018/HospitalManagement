const express = require('express');
const router = express.Router();
const { createPrescription, getMyPrescriptions, getDoctorPrescriptions, getPrescriptionById } = require('../controllers/prescription.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/my', protect, authorize('patient'), getMyPrescriptions);
router.get('/doctor', protect, authorize('doctor'), getDoctorPrescriptions);
router.get('/:id', protect, getPrescriptionById);

module.exports = router;