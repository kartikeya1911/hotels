/**
 * Global error handling middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error(err.stack);

    // Default error response
    const errorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };

    // Handle specific error types
    if (err.name === 'ValidationError') {
        // Mongoose validation error
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'CastError') {
        // Mongoose cast error (invalid ID format)
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    if (err.name === 'JsonWebTokenError') {
        // JWT error
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        // JWT expired error
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            error: 'TOKEN_EXPIRED'
        });
    }

    if (err.code === 11000) {
        // MongoDB duplicate key error
        return res.status(409).json({
            success: false,
            message: 'Duplicate entry',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    // Handle custom error status codes
    if (err.status) {
        return res.status(err.status).json(errorResponse);
    }

    // Default to 500 Internal Server Error
    res.status(500).json(errorResponse);
};

module.exports = errorHandler;