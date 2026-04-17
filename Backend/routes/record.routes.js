const express = require('express');
const router = express.Router();
const { uploadRecord, getMyRecords, getPatientRecords, downloadRecord, deleteRecord, shareRecord, uploadDoctorNote } = require('../controllers/record.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', protect, authorize('patient'), upload.single('file'), uploadRecord);
router.post('/doctor-note', protect, authorize('doctor'), upload.single('file'), uploadDoctorNote);
router.get('/my', protect, authorize('patient'), getMyRecords);
router.get('/patient/:patientId', protect, authorize('doctor', 'admin'), getPatientRecords);
router.get('/:id/download', protect, downloadRecord);
router.post('/:id/share', protect, authorize('patient'), shareRecord);
router.delete('/:id', protect, authorize('patient'), deleteRecord);

module.exports = router;