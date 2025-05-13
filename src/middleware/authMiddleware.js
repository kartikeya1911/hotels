const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

// Middleware to verify access token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token is required' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password -refreshToken');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired',
                error: 'TOKEN_EXPIRED'
            });
        }
        return res.status(403).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

// Middleware to verify refresh token
const authenticateRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ 
                success: false,
                message: 'Refresh token is required' 
            });
        }

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ 
                success: false,
                message: 'Invalid refresh token' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false,
            message: 'Invalid refresh token' 
        });
    }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication required' 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: 'You do not have permission to perform this action' 
            });
        }

        next();
    };
};

// Email verification check middleware
const checkEmailVerification = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication required' 
            });
        }

        if (!req.user.isVerified) {
            return res.status(403).json({ 
                success: false,
                message: 'Please verify your email address first' 
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authenticateToken,
    authenticateRefreshToken,
    authorizeRoles,
    checkEmailVerification
};