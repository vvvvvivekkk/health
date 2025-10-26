const express = require('express');
const router = express.Router();
const { 
  getAppointments, 
  createAppointment, 
  updateAppointment, 
  approveAppointment,
  rejectAppointment,
  deleteAppointment 
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

router.route('/:id')
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

router.put('/:id/approve', protect, approveAppointment);
router.put('/:id/reject', protect, rejectAppointment);

module.exports = router;