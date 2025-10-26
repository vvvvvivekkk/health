const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  let appointments;
  
  // Admin can see all appointments
  if (req.user.role === 'admin') {
    const keyword = req.query.search
      ? {
          $or: [
            { studentName: { $regex: req.query.search, $options: 'i' } },
            { doctorName: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {};
      
    appointments = await Appointment.find(keyword).populate('student', 'name email').populate('doctor', 'name');
  } 
  // Doctor can see their own appointments
  else if (req.user.role === 'doctor') {
    const keyword = req.query.search
      ? {
          $and: [
            { doctor: req.user._id },
            {
              $or: [
                { studentName: { $regex: req.query.search, $options: 'i' } },
                { doctorName: { $regex: req.query.search, $options: 'i' } }
              ]
            }
          ]
        }
      : { doctor: req.user._id };
      
    appointments = await Appointment.find(keyword).populate('student', 'name email');
  }
  // Student can only see their own appointments
  else {
    const keyword = req.query.search
      ? {
          $and: [
            { student: req.user._id },
            {
              $or: [
                { studentName: { $regex: req.query.search, $options: 'i' } },
                { doctorName: { $regex: req.query.search, $options: 'i' } }
              ]
            }
          ]
        }
      : { student: req.user._id };
      
    appointments = await Appointment.find(keyword);
  }
  
  res.json(appointments);
});

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private/Student
const createAppointment = asyncHandler(async (req, res) => {
  // Only students can create appointments
  if (req.user.role !== 'student') {
    res.status(401);
    throw new Error('Not authorized to create appointments');
  }
  
  const { doctorId, doctorName, date, time } = req.body;
  
  // Validate doctor exists
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') {
    res.status(400);
    throw new Error('Invalid doctor');
  }
  
  const appointment = await Appointment.create({
    student: req.user._id,
    doctor: doctorId,
    studentName: req.user.name,
    doctorName,
    date,
    time,
    status: 'pending',
  });
  
  res.status(201).json(appointment);
});

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private/Admin, Doctor
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  // Admin can update any appointment
  // Doctor can update their own appointments
  // Student can only update their own appointments if status is pending
  if (req.user.role === 'admin') {
    // Admin can update anything
  } else if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this appointment');
  } else if (req.user.role === 'student' && appointment.student.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this appointment');
  } else if (req.user.role === 'student' && appointment.status !== 'pending') {
    res.status(400);
    throw new Error('Cannot update appointment that is not pending');
  }
  
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  res.json(updatedAppointment);
});

// @desc    Approve appointment
// @route   PUT /api/appointments/:id/approve
// @access  Private/Doctor, Admin
const approveAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  // Only doctor for this appointment or admin can approve
  if ((req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) && 
      req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to approve this appointment');
  }
  
  appointment.status = 'approved';
  const updatedAppointment = await appointment.save();
  
  res.json(updatedAppointment);
});

// @desc    Reject appointment
// @route   PUT /api/appointments/:id/reject
// @access  Private/Doctor, Admin
const rejectAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  // Only doctor for this appointment or admin can reject
  if ((req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) && 
      req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to reject this appointment');
  }
  
  appointment.status = 'rejected';
  const updatedAppointment = await appointment.save();
  
  res.json(updatedAppointment);
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin, Student (only pending appointments)
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  
  // Admin can delete any appointment
  // Student can delete their own pending appointments
  if (req.user.role === 'admin') {
    // Admin can delete anything
  } else if (req.user.role === 'student' && appointment.student.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this appointment');
  } else if (req.user.role === 'student' && appointment.status !== 'pending') {
    res.status(400);
    throw new Error('Can only delete pending appointments');
  } else if (req.user.role !== 'admin' && req.user.role !== 'student') {
    res.status(401);
    throw new Error('Not authorized to delete appointments');
  }
  
  await appointment.deleteOne();
  
  res.json({ message: 'Appointment removed' });
});

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  approveAppointment,
  rejectAppointment,
  deleteAppointment,
};