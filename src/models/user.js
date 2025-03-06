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

// Add a new user
const addUser = (username, password) => {
    const data = loadData();
    if (data.users.find(user => user.username === username)) {
        throw new Error('User already exists');
    }
    const newUser = { username, password }; // In production, hash the password
    data.users.push(newUser);
    saveData(data); // Save updated data
    return newUser;
};

// Find a user by credentials
const findUserByCredentials = (username, password) => {
    const data = loadData();
    return data.users.find(u => u.username === username && u.password === password);
};

module.exports = { addUser, findUserByCredentials };