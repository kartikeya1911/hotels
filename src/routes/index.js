const express = require('express');
const path = require('path');
const authRouter = require('./auth');
const hotelsRouter = require('./hotels');

const router = express.Router();

// Static Page Routes
router.get('/', (req, res) => {
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
});

// API Routes
router.use('/api/auth', authRouter);
router.use('/api/hotels', hotelsRouter);

// 404 Handler
router.use((req, res) => {
    res.status(404).render('not-found');
});

// Error Handler
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router;
