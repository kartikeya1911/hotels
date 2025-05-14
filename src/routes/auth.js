const express = require('express');
const { 
    registerUser, 
    loginUser, 
    logoutUser,
<<<<<<< HEAD
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
=======
    forgotPassword,
    resetPassword,
>>>>>>> 5e11ea609219d455b837c9e073c39f1ca06ed342
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
<<<<<<< HEAD
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Protected Routes
router.post('/logout', authenticateToken, logoutUser);
router.post('/refresh-token', refreshToken);

module.exports = router;
=======

// Protected Routes
router.post('/logout', authenticateToken, logoutUser);

module.exports = router;
>>>>>>> 5e11ea609219d455b837c9e073c39f1ca06ed342
