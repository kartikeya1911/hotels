const express = require('express');
const path = require('path');
const authRouter = require('./auth');
const hotelsRouter = require('./hotels');

const router = express.Router();

// Static Page Routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'home.html'));
});

router.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'home.html'));
});

router.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'login.html'));
});

router.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'register.html'));
});

router.get('/virtual-tours.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'virtual-tours.html'));
});

router.get('/sustainability.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'sustainability.html'));
});

router.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'contact.html'));
});

router.get('/not-found.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'not-found.html'));
});

router.get('/dining.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'dining.html'));
});

router.get('/hotels.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'hotels.html'));
});

router.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'dashboard.html'));
});

router.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'about.html'));
});

// API Routes
router.use('/api/auth', authRouter);
router.use('/api/hotels', hotelsRouter);

// 404 Handler
router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../../public', 'not-found.html'));
});

// Error Handler
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router;