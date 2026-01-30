const express = require('express');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const router = express.Router();

// User: create appointment
router.post('/', async (req, res) => {
  const { name, phone, email, preferredDate, preferredTime, message } = req.body;
  const appointment = new Appointment({ name, phone, email, preferredDate, preferredTime, message });
  await appointment.save();
  res.status(201).json(appointment);
});

// Admin: view appointments, filter by date
router.get('/', auth, async (req, res) => {
  const { date } = req.query;
  const query = date ? {
    preferredDate: {
      $gte: new Date(date),
      $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    }
  } : {};
  const appointments = await Appointment.find(query).sort('-createdAt');
  res.json(appointments);
});

// Admin: mark as completed/incomplete
router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  if (!appointment) return res.status(404).json({ message: 'Not found' });
  res.json(appointment);
});

// Admin: get appointment details
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) return res.status(404).json({ message: 'Not found' });
  res.json(appointment);
});

module.exports = router;