const express = require('express');
const { getHotels, addHotel } = require('../controllers/hotelsController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get Hotels
router.get('/', authenticateToken, getHotels);

// Add Hotel
router.post('/', authenticateToken, addHotel);

module.exports = router;