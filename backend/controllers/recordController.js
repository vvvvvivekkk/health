const MedicalRecord = require('../models/medicalRecordModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Get medical records
// @route   GET /api/records
// @access  Private
const getRecords = asyncHandler(async (req, res) => {
  let records;
  
  // Admin can see all records
  if (req.user.role === 'admin') {
    const keyword = req.query.search
      ? {
          $or: [
            { studentName: { $regex: req.query.search, $options: 'i' } },
            { bloodGroup: { $regex: req.query.search, $options: 'i' } },
            { allergies: { $regex: req.query.search, $options: 'i' } },
            { prescription: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {};
      
    records = await MedicalRecord.find(keyword).populate('student', 'name email');
  } 
  // Doctor can see all records
  else if (req.user.role === 'doctor') {
    const keyword = req.query.search
      ? {
          $or: [
            { studentName: { $regex: req.query.search, $options: 'i' } },
            { bloodGroup: { $regex: req.query.search, $options: 'i' } },
            { allergies: { $regex: req.query.search, $options: 'i' } },
            { prescription: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {};
      
    records = await MedicalRecord.find(keyword).populate('student', 'name email');
  }
  // Student can only see their own records
  else {
    records = await MedicalRecord.find({ student: req.user._id });
  }
  
  res.json(records);
});

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private/Admin or Doctor
const createRecord = asyncHandler(async (req, res) => {
  console.log('📝 Create medical record request from:', req.user.name, '(', req.user.role, ')');
  console.log('📋 Request body:', req.body);
  
  // Only admin and doctors can create records
  if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
    res.status(401);
    throw new Error('Not authorized to create medical records');
  }
  
  const { studentId, studentName, bloodGroup, allergies, prescription } = req.body;
  
  // Validate required fields
  if (!studentId) {
    res.status(400);
    throw new Error('Student ID is required');
  }
  
  if (!bloodGroup) {
    res.status(400);
    throw new Error('Blood group is required');
  }
  
  console.log('🔍 Looking for student with ID:', studentId);
  
  // Validate student exists
  const student = await User.findById(studentId);
  
  if (!student) {
    console.error('❌ Student not found with ID:', studentId);
    res.status(400);
    throw new Error('Student not found in database');
  }
  
  if (student.role !== 'student') {
    console.error('❌ User is not a student. Role:', student.role);
    res.status(400);
    throw new Error('Selected user is not a student');
  }
  
  console.log('✅ Student found:', student.name);
  
  const record = await MedicalRecord.create({
    student: studentId,
    studentName: studentName || student.name,
    bloodGroup,
    allergies: allergies || 'None',
    prescription: prescription || 'None',
  });
  
  console.log('✅ Medical record created successfully:', record._id);
  res.status(201).json(record);
});

// @desc    Update a medical record
// @route   PUT /api/records/:id
// @access  Private/Admin or Doctor
const updateRecord = asyncHandler(async (req, res) => {
  // Only admin and doctors can update records
  if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
    res.status(401);
    throw new Error('Not authorized to update medical records');
  }
  
  const record = await MedicalRecord.findById(req.params.id);
  
  if (!record) {
    res.status(404);
    throw new Error('Medical record not found');
  }
  
  const updatedRecord = await MedicalRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  res.json(updatedRecord);
});

// @desc    Delete a medical record
// @route   DELETE /api/records/:id
// @access  Private/Admin
const deleteRecord = asyncHandler(async (req, res) => {
  // Only admin can delete records
  if (req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete medical records');
  }
  
  const record = await MedicalRecord.findById(req.params.id);
  
  if (!record) {
    res.status(404);
    throw new Error('Medical record not found');
  }
  
  await record.deleteOne();
  
  res.json({ message: 'Medical record removed' });
});

module.exports = {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};