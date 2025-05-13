const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Protected Routes
router.post('/logout', authenticateToken, logoutUser);
router.post('/refresh-token', refreshToken);

module.exports = router;