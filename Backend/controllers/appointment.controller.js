const Appointment = require('../models/Appointment.model');
const Doctor = require('../models/Doctor.model');
const User = require('../models/User.model');
const Queue = require('../models/Queue.model');
const queueService = require('../services/queue.service');
const notificationService = require('../services/notification.service');

/* ── Status normalisation ────────────────────────────────── */
const STATUS_MAP = {
  waiting: 'waiting',
  active: 'active',
  done: 'completed',
  Waiting: 'waiting',
  'In Progress': 'active',
  'in-progress': 'active',
  'in progress': 'active',
  Done: 'completed',
  Upcoming: 'scheduled',
  upcoming: 'scheduled',
  scheduled: 'scheduled',
  completed: 'completed',
  skipped: 'skipped',
  cancelled: 'cancelled',
  missed: 'missed',
};

const normaliseStatus = (raw) => {
  if (!raw) return null;
  return STATUS_MAP[raw] ?? STATUS_MAP[raw.toLowerCase()] ?? null;
};

const DOCTOR_POPULATE = {
  path: 'doctor',
  populate: { path: 'user', select: 'name email' },
};

const AVG_CONSULT_MINS = 15;

/* ── Helpers ─────────────────────────────────────────────── */

/**
 * Auto-mark stale appointments as "missed".
 * Any appointment whose date+timeSlot is in the past and still
 * scheduled/waiting gets flipped to "missed".
 */
const autoMarkMissed = async (filter) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Only auto-miss appointments from before today (leave today's alone)
  await Appointment.updateMany(
    {
      ...filter,
      status: { $in: ['scheduled', 'waiting'] },
      date: { $lt: new Date(todayStr + 'T00:00:00') },
    },
    { $set: { status: 'missed' } }
  );
};

/**
 * After marking an appointment "completed" or "skipped",
 * auto-advance the queue: find the next waiting appointment
 * (lowest tokenNumber) for the same doctor+date and set it "active".
 */
const autoAdvanceQueue = async (completedAppointment) => {
  const dayStart = new Date(completedAppointment.date.toISOString().split('T')[0] + 'T00:00:00');
  const dayEnd = new Date(completedAppointment.date.toISOString().split('T')[0] + 'T23:59:59');

  // Check if someone is already active for this doctor today
  const alreadyActive = await Appointment.findOne({
    doctor: completedAppointment.doctor,
    date: { $gte: dayStart, $lte: dayEnd },
    status: 'active'
  });

  if (alreadyActive) return null;

  const nextWaiting = await Appointment.findOne({
    doctor: completedAppointment.doctor,
    date: { $gte: dayStart, $lte: dayEnd },
    status: 'waiting',
  }).sort({ tokenNumber: 1 });

  if (nextWaiting) {
    nextWaiting.status = 'active';
    await nextWaiting.save();

    // Notify patient that their turn has arrived
    try {
      await notificationService.createNotification({
        userId: nextWaiting.patient,
        title: 'Your Turn!',
        message: `Token #${nextWaiting.tokenNumber} — the doctor is ready to see you now.`,
        type: 'queue',
        link: '/appointments',
      });
    } catch { /* notification failures should not block queue */ }

    return nextWaiting;
  }
  return null;
};

/**
 * Ensure at least one appointment is "active" for a doctor's day.
 * If none is active, promote the first waiting one.
 */
const ensureActiveExists = async (doctorId, dateStr) => {
  const dayFilter = {
    doctor: doctorId,
    date: {
      $gte: new Date(dateStr + 'T00:00:00'),
      $lte: new Date(dateStr + 'T23:59:59'),
    },
  };

  const alreadyActive = await Appointment.findOne({ ...dayFilter, status: 'active' });
  if (alreadyActive) return;

  const firstWaiting = await Appointment.findOne({ ...dayFilter, status: 'waiting' }).sort({ tokenNumber: 1 });
  if (firstWaiting) {
    firstWaiting.status = 'active';
    await firstWaiting.save();
  }
};

/**
 * Add estimatedWait and currentToken to each appointment based on token position.
 */
const enrichWithWaitTime = async (appointments) => {
  // Pre-fetch all queues for the external appointments to avoid N+1 issues
  const doctorDatePairs = Array.from(new Set(appointments.map(a => 
    `${a.doctor?._id || a.doctor}|${new Date(a.date).toISOString().split('T')[0]}`
  )));

  const queues = await Queue.find({
    $or: doctorDatePairs.map(pair => {
      const [doctor, date] = pair.split('|');
      return { doctor, date };
    })
  });

  const queueMap = new Map();
  queues.forEach(q => queueMap.set(`${q.doctor}|${q.date}`, q.currentToken));

  return appointments.map(a => {
    const obj = a.toObject ? a.toObject() : { ...a };
    const dateStr = new Date(obj.date).toISOString().split('T')[0];
    const currentToken = queueMap.get(`${obj.doctor?._id || obj.doctor}|${dateStr}`) || 0;
    
    obj.currentToken = currentToken;

    if (['waiting', 'scheduled'].includes(obj.status) && obj.tokenNumber) {
      const position = Math.max(0, obj.tokenNumber - currentToken);
      obj.estimatedWait = position * AVG_CONSULT_MINS;
    } else {
      obj.estimatedWait = 0;
    }
    return obj;
  });
};

/* ══════════════════════════════════════════════════════════
   CONTROLLERS
══════════════════════════════════════════════════════════ */

const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;

    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor)
      return res.status(404).json({ success: false, message: 'Doctor not found' });

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      symptoms: symptoms || 'General Checkup',
      status: 'scheduled',
    });

    const dateStr = new Date(date).toISOString().split('T')[0];
    const { tokenNumber, position } = await queueService.assignToken(
      doctorId, dateStr, appointment._id, req.user._id
    );

    // Persist token
    appointment.tokenNumber = tokenNumber;
    appointment.queuePosition = position;
    await appointment.save();

    const admin = await User.findOne({ role: 'admin' });
    await notificationService.notifyAppointmentBooked({
      patientId: req.user._id,
      doctorUserId: doctor.user._id,
      adminId: admin?._id,
      patientName: req.user.name,
      doctorName: doctor.user.name,
      date,
      timeSlot,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate(DOCTOR_POPULATE)
      .populate('patient', 'name email phone');

    res.status(201).json({
      success: true,
      appointment: populated,
      tokenNumber,
      queuePosition: position,
    });
  } catch (error) {
    next(error);
  }
};

/* ── Patient: my appointments ────────────────────────────── */
const getMyAppointments = async (req, res, next) => {
  try {
    // Auto-mark old ones as missed
    await autoMarkMissed({ patient: req.user._id });

    const appointments = await Appointment.find({ patient: req.user._id })
      .populate(DOCTOR_POPULATE)
      .populate('patient', 'name email phone')
      .sort({ date: -1, tokenNumber: 1 });

    res.json({ success: true, appointments: await enrichWithWaitTime(appointments) });
  } catch (error) {
    next(error);
  }
};

/* ── Doctor: today's queue ───────────────────────────────── */
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor)
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    const { date, status } = req.query;
    const filter = { doctor: doctor._id };

    if (date) {
      filter.date = {
        $gte: new Date(date + 'T00:00:00'),
        $lte: new Date(date + 'T23:59:59'),
      };
    }
    if (status) {
      const db = normaliseStatus(status);
      if (db) filter.status = db;
    }

    // Auto-mark stale appointments
    await autoMarkMissed(filter);

    // Auto-ensure an active patient exists (fallback)
    if (date) {
      await ensureActiveExists(doctor._id, date);
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .sort({ tokenNumber: 1 });

    res.json({ success: true, appointments: await enrichWithWaitTime(appointments) });
  } catch (error) {
    next(error);
  }
};

/* ── Admin: all appointments ─────────────────────────────── */
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) {
      const db = normaliseStatus(status);
      if (db) filter.status = db;
    }
    if (date) {
      filter.date = {
        $gte: new Date(date + 'T00:00:00'),
        $lte: new Date(date + 'T23:59:59'),
      };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email')
      .populate(DOCTOR_POPULATE)
      .sort({ date: -1 });

    res.json({ success: true, appointments: await enrichWithWaitTime(appointments) });
  } catch (error) {
    next(error);
  }
};

/* ── Cancel ──────────────────────────────────────────────── */
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled', appointment });
  } catch (error) {
    next(error);
  }
};

/* ── Update status (doctor/admin) — WITH auto-advance ───── */
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const dbStatus = normaliseStatus(status);
    if (!dbStatus)
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ success: false, message: 'Appointment not found' });

    const prevStatus = appointment.status;
    appointment.status = dbStatus;
    await appointment.save();

    // ✅ AUTO-ADVANCE: when completing or skipping → activate next waiting patient
    if (['completed', 'skipped'].includes(dbStatus) && ['active', 'waiting'].includes(prevStatus)) {
      await autoAdvanceQueue(appointment);
    }

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email')
      .populate(DOCTOR_POPULATE);

    res.json({ success: true, appointment: populated });
  } catch (error) {
    next(error);
  }
};

/* ── Skip (patient self-skip) ────────────────────────────── */
const skipAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Only allow skipping if waiting or scheduled
    if (!['waiting', 'scheduled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot skip appointment with status "${appointment.status}"`,
      });
    }

    appointment.status = 'skipped';
    await appointment.save();

    // Auto-advance if needed
    await autoAdvanceQueue(appointment);

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email')
      .populate(DOCTOR_POPULATE);

    res.json({ success: true, message: 'Appointment skipped', appointment: populated });
  } catch (error) {
    next(error);
  }
};

/* ── Delete Appointment (Admin) ─────────────────────────── */
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ success: false, message: 'Appointment not found' });

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  skipAppointment,
  deleteAppointment,
};