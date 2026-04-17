const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllDoctors, addDoctor, addPatient, toggleUserStatus, deleteUser, deleteDoctor } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const adminOnly = [protect, authorize('admin')];

router.get('/stats', ...adminOnly, getStats);
router.get('/users', ...adminOnly, getAllUsers);
router.post('/users', ...adminOnly, addPatient);
router.get('/doctors', ...adminOnly, getAllDoctors);
router.post('/doctors', ...adminOnly, addDoctor);
router.put('/users/:id/toggle', ...adminOnly, toggleUserStatus);
router.delete('/users/:id', ...adminOnly, deleteUser);
router.delete('/doctors/:id', ...adminOnly, deleteDoctor);

module.exports = router;