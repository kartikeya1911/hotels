const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { addUser, findUserByCredentials } = require('./src/models/user');
const { getHotels, addHotel } = require('./src/models/hotel');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key'; // Replace with a secure key in production

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// Static Page Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/virtual-tours.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'virtual-tours.html'));
});

app.get('/sustainability.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sustainability.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/not-found.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'not-found.html'));
});

app.get('/dining.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dining.html'));
});

app.get('/hotels.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hotels.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Endpoints
// Register User
app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const newUser = addUser(username, password);
        console.log('New user registered:', newUser); // Log for debugging
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error.message); // Log error
        res.status(400).json({ message: error.message });
    }
});

// Login User
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = findUserByCredentials(username, password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Get Hotels
app.get('/api/hotels', authenticateToken, (req, res) => {
    const hotels = getHotels();
    res.json(hotels);
});

// Add Hotel
app.post('/api/hotels', authenticateToken, (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Hotel name is required' });
    }

    const newHotel = addHotel(name);
    res.status(201).json(newHotel);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'not-found.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});