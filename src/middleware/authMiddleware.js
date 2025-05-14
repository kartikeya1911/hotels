const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

module.exports = {
    authenticateToken,
    authorizeRoles,
<<<<<<< HEAD
};
=======
};
>>>>>>> 5e11ea609219d455b837c9e073c39f1ca06ed342
