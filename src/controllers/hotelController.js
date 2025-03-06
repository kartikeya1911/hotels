const Hotel = require('../models/hotel');

// Get Hotels
const getHotels = (req, res) => {
    const hotels = Hotel.getAll();
    res.json(hotels);
};

// Add Hotel
const addHotel = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Hotel name is required' });
    }

    const newHotel = Hotel.save(name);
    res.status(201).json(newHotel);
};

module.exports = { getHotels, addHotel };