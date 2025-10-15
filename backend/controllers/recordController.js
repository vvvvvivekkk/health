const MedicalRecord = require('../models/medicalRecordModel');

// @desc    Get all medical records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({});
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  try {
    const { studentName, bloodGroup, allergies, prescription } = req.body;
    
    const record = await MedicalRecord.create({
      studentName,
      bloodGroup,
      allergies,
      prescription,
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a medical record
// @route   PUT /api/records/:id
// @access  Private
const updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a medical record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    await record.deleteOne();
    
    res.json({ message: 'Medical record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};