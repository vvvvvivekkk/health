const mongoose = require('mongoose');

const medicalRecordSchema = mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Please add a student name'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please add a blood group'],
    },
    allergies: {
      type: String,
      default: 'None',
    },
    prescription: {
      type: String,
      default: 'None',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);