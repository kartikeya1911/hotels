const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { sendEmail } = require('../utils/emailService');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// Register User
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Username, email and password are required' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create new user with plain text password
        const newUser = new User({
            username,
            email,
            password, // Store password in plain text
            isVerified: false
        });

        await newUser.save();

        // Generate verification token
        const verificationToken = jwt.sign(
            { userId: newUser._id },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Send verification email
        await sendEmail({
            to: email,
            subject: 'Verify your email',
            html: `Click <a href="${process.env.BASE_URL}/verify-email?token=${verificationToken}">here</a> to verify your email.`
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for verification.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Direct password comparison
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first'
            });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            REFRESH_SECRET_KEY,
            { expiresIn: '7d' }
        );

        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging out',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Refresh Token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: '15m' }
        );

        res.json({
            success: true,
            accessToken
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Error refreshing token',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const resetToken = jwt.sign(
            { userId: user._id },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        await sendEmail({
            to: email,
            subject: 'Password Reset',
            html: `Click <a href="${process.env.BASE_URL}/reset-password?token=${resetToken}">here</a> to reset your password.`
        });

        res.json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing forgot password request',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Store new password in plain text
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.userId);

    if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isVerified = true;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Resend Verification Email
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
        }

        const verificationToken = jwt.sign(
            { userId: user._id },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        await sendEmail({
            to: email,
            subject: 'Verify your email',
            html: `Click <a href="${process.env.BASE_URL}/verify-email?token=${verificationToken}">here</a> to verify your email.`
        });

        res.json({
            success: true,
            message: 'Verification email sent'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resending verification email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
};