const express = require('express');
const router = express.Router();
const { getTodayQueue, getQueueByDate, advanceQueue, getMyQueueStatus, getAllQueues } = require('../controllers/queue.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/today', protect, authorize('doctor'), getTodayQueue);
router.get('/status', protect, authorize('patient'), getMyQueueStatus);
router.get('/all', protect, authorize('admin'), getAllQueues);
router.get('/:doctorId/:date', protect, getQueueByDate);
router.post('/advance', protect, authorize('doctor'), advanceQueue);

module.exports = router;