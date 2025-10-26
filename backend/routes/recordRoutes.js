const express = require('express');
const router = express.Router();
const { 
  getRecords, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} = require('../controllers/recordController');
const { protect, admin, adminOrDoctor } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getRecords)
  .post(protect, adminOrDoctor, createRecord);

router.route('/:id')
  .put(protect, adminOrDoctor, updateRecord)
  .delete(protect, admin, deleteRecord);

module.exports = router;