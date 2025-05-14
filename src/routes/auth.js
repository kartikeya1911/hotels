const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser,
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.post('/logout', authenticateToken, logoutUser);

module.exports = router;