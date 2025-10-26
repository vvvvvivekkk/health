const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getDoctors, getStudents } = require('../controllers/userController');
const { protect, admin, adminOrDoctor } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/doctors', getDoctors);  // Allow unauthenticated access to get doctors list
router.get('/students', protect, adminOrDoctor, getStudents);  // Admin and Doctor can view students

module.exports = router;