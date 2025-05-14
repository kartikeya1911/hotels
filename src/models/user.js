const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    totalStays: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    recentActivity: [{
        type: String,
        date: Date
    }],
    recentStays: [{
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel'
        },
        checkIn: Date,
        checkOut: Date
    }],
    recentReviews: [{
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel'
        },
        rating: Number,
        comment: String,
        date: Date
    }],
    achievements: [{
        name: String,
        date: Date
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema); 