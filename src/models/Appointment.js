const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['Incomplete', 'Completed'], default: 'Incomplete' }
},{ timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);