const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Please add a student name'],
    },
    doctorName: {
      type: String,
      required: [true, 'Please add a doctor name'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);