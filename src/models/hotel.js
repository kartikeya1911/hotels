const fs = require('fs');
const path = require('path');

// Load data from data.json
const loadData = () => {
    const dataPath = path.join(__dirname, 'data.json');
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

// Save data to data.json
const saveData = (data) => {
    const dataPath = path.join(__dirname, 'data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

// Get all hotels
const getHotels = () => {
    const data = loadData();
    return data.hotels;
};

// Add a new hotel
const addHotel = (name) => {
    const data = loadData();
    const newHotel = { id: data.hotels.length + 1, name };
    data.hotels.push(newHotel);
    saveData(data); // Save updated data
    return newHotel;
};

module.exports = { getHotels, addHotel };