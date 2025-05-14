const express = require('express');
const path = require('path');
const authRouter = require('./auth');
const hotelsRouter = require('./hotels');

const router = express.Router();

// Static Page Routes
router.get('/', (req, res) => {
<<<<<<< HEAD
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
=======
    res.render('home');
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/virtual-tours', (req, res) => {
    res.render('virtual-tours');
});

router.get('/sustainability', (req, res) => {
    res.render('sustainability');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/not-found', (req, res) => {
    res.render('not-found');
});

router.get('/dining', (req, res) => {
    res.render('dining');
});

router.get('/hotels', (req, res) => {
    res.render('hotels');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

router.get('/about', (req, res) => {
    res.render('about');
>>>>>>> 5e11ea609219d455b837c9e073c39f1ca06ed342
});

// API Routes
router.use('/api/auth', authRouter);
router.use('/api/hotels', hotelsRouter);

// 404 Handler
router.use((req, res) => {
<<<<<<< HEAD
    res.status(404).sendFile(path.join(__dirname, '../../public', 'not-found.html'));
=======
    res.status(404).render('not-found');
>>>>>>> 5e11ea609219d455b837c9e073c39f1ca06ed342
});

// Error Handler
router.use((err, req, res, next) => {
    console.error(err.stack);
<<<<<<< HEAD
    res.status(500).json({
        success: false,
=======
    res.status(500).render('error', {
>>>>>>> 5e11ea609219d455b837c9e073c39f1ca06ed342
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> 5e11ea609219d455b837c9e073c39f1ca06ed342
