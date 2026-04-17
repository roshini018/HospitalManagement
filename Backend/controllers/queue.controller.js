const queueService = require('../services/queue.service');
const notificationService = require('../services/notification.service');
const Doctor = require('../models/Doctor.model');
const Queue = require('../models/Queue.model');

const getTodayQueue = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const today = new Date().toISOString().split('T')[0];
    const status = await queueService.getQueueStatus(doctor._id, today);

    res.json({ success: true, queue: status });
  } catch (error) {
    next(error);
  }
};

const getQueueByDate = async (req, res, next) => {
  try {
    const { doctorId, date } = req.params;
    const status = await queueService.getQueueStatus(doctorId, date);
    res.json({ success: true, queue: status });
  } catch (error) {
    next(error);
  }
};

const advanceQueue = async (req, res, next) => {
  try {
    const { queueId, entryId, action } = req.body;
    if (!['start', 'complete', 'skip'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    const queue = await queueService.advanceQueue(queueId, action, entryId);

    // Notify next patient if completing/skipping
    if (action === 'complete' || action === 'skip') {
      const nextWaiting = queue.entries.find(e => e.status === 'waiting');
      if (nextWaiting) {
        const waitingCount = queue.entries.filter(e => e.status === 'waiting').length;
        await notificationService.notifyQueueUpdate({
          patientId: nextWaiting.patient,
          tokenNumber: nextWaiting.tokenNumber,
          currentToken: queue.currentToken,
          position: 1
        });
      }
    }

    res.json({ success: true, message: `Queue entry ${action}ed` });
  } catch (error) {
    next(error);
  }
};

const getMyQueueStatus = async (req, res, next) => {
  try {
    const { doctorId, date, tokenNumber } = req.query;
    const status = await queueService.getPatientQueuePosition(doctorId, date, parseInt(tokenNumber));
    if (!status) return res.status(404).json({ success: false, message: 'Queue not found' });
    res.json({ success: true, status });
  } catch (error) {
    next(error);
  }
};

const getAllQueues = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const queues = await Queue.find({ date: today })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    res.json({ success: true, queues });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodayQueue, getQueueByDate, advanceQueue, getMyQueueStatus, getAllQueues };