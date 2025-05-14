const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Routes
router.post('/logout', authenticateToken, logoutUser);

module.exports = router;
