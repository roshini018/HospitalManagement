const Queue = require('../models/Queue.model');
const Appointment = require('../models/Appointment.model');

const getOrCreateQueue = async (doctorId, date) => {
  let queue = await Queue.findOne({ doctor: doctorId, date });
  if (!queue) {
    queue = await Queue.create({ doctor: doctorId, date, currentToken: 0, nextToken: 1, entries: [] });
  }
  return queue;
};

const assignToken = async (doctorId, date, appointmentId, patientId) => {
  const queue = await getOrCreateQueue(doctorId, date);
  const tokenNumber = queue.nextToken;

  queue.entries.push({ appointment: appointmentId, patient: patientId, tokenNumber, status: 'waiting', checkedInAt: new Date() });
  queue.nextToken += 1;
  await queue.save();

  // Update appointment with token
  await Appointment.findByIdAndUpdate(appointmentId, { tokenNumber, status: 'waiting', queuePosition: queue.entries.length });

  return { tokenNumber, position: queue.entries.filter(e => e.status === 'waiting').length };
};

const getQueueStatus = async (doctorId, date) => {
  const queue = await Queue.findOne({ doctor: doctorId, date })
    .populate('entries.patient', 'name')
    .populate('entries.appointment');
  if (!queue) return null;

  const waitingEntries = queue.entries.filter(e => e.status === 'waiting');
  const inProgressEntry = queue.entries.find(e => e.status === 'in-progress');

  return {
    queueId: queue._id,
    isActive: queue.isActive,
    currentToken: queue.currentToken,
    nextToken: queue.nextToken,
    avgConsultationTime: queue.avgConsultationTime,
    waiting: waitingEntries,
    inProgress: inProgressEntry,
    totalWaiting: waitingEntries.length,
  };
};

const advanceQueue = async (queueId, action, entryId) => {
  const queue = await Queue.findById(queueId);
  if (!queue) throw new Error('Queue not found');

  const entryIndex = queue.entries.findIndex(e => e._id.toString() === entryId);
  if (entryIndex === -1) throw new Error('Entry not found in queue');

  const entry = queue.entries[entryIndex];

  if (action === 'start') {
    entry.status = 'in-progress';
    entry.startedAt = new Date();
    queue.currentToken = entry.tokenNumber;
    queue.isActive = true;
    await Appointment.findByIdAndUpdate(entry.appointment, { status: 'in-progress' });
  } else if (action === 'complete') {
    entry.status = 'completed';
    entry.completedAt = new Date();
    await Appointment.findByIdAndUpdate(entry.appointment, { status: 'completed' });
  } else if (action === 'skip') {
    entry.status = 'skipped';
    await Appointment.findByIdAndUpdate(entry.appointment, { status: 'skipped' });
  }

  await queue.save();
  return queue;
};

const getPatientQueuePosition = async (doctorId, date, tokenNumber) => {
  const queue = await Queue.findOne({ doctor: doctorId, date });
  if (!queue) return null;

  const waitingEntries = queue.entries.filter(e => e.status === 'waiting');
  const myIndex = waitingEntries.findIndex(e => e.tokenNumber === tokenNumber);
  const position = myIndex >= 0 ? myIndex + 1 : 0;
  const estimatedWait = position * (queue.avgConsultationTime || 10);

  return {
    currentToken: queue.currentToken,
    myToken: tokenNumber,
    position,
    estimatedWait,
    isActive: queue.isActive
  };
};

module.exports = { getOrCreateQueue, assignToken, getQueueStatus, advanceQueue, getPatientQueuePosition };