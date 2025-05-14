const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./src/config/database');
const User = require('./src/models/user');
const Booking = require('./src/models/booking');
const Contact = require('./src/models/Contact');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Session middleware
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    name: 'sessionId'
}));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', apiLimiter);

// Add middleware to pass user and isLoggedIn to all templates
app.use((req, res, next) => {
    res.locals.user = req.session && req.session.user ? req.session.user : null;
    res.locals.isLoggedIn = !!req.session.user;
    next();
});

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Default hotels data
const defaultHotels = {
    'new-york': {
        id: 'new-york',
        name: 'LuxeStay New York',
        location: 'Manhattan, NY',
        rating: 5,
        price: 450,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Free Wi-Fi', 'Pool', 'Spa', 'Restaurant'],
        description: 'Experience luxury in the heart of Manhattan with stunning city views and world-class amenities.',
        rooms: [
            {
                name: 'Deluxe King Room',
                price: 450,
                maxGuests: 2,
                bedType: 'King Bed',
                size: 45,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV']
            },
            {
                name: 'Executive Suite',
                price: 650,
                maxGuests: 2,
                bedType: 'King Bed',
                size: 65,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Private Balcony']
            }
        ]
    },
    'london': {
        id: 'london',
        name: 'LuxeStay London',
        location: 'Mayfair, London',
        rating: 5,
        price: 380,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Free Wi-Fi', 'Pool', 'Spa', 'Restaurant'],
        description: 'Elegant luxury in the heart of Mayfair, offering a perfect blend of classic British charm and modern comfort.',
        rooms: [
            {
                name: 'Deluxe King Room',
                price: 380,
                maxGuests: 2,
                bedType: 'King Bed',
                size: 40,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV']
            },
            {
                name: 'Executive Suite',
                price: 580,
                maxGuests: 2,
                bedType: 'King Bed',
                size: 60,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Private Balcony']
            }
        ]
    },
    'paris': {
        id: 'paris',
        name: 'LuxeStay Paris',
        location: 'Champs-Élysées, Paris',
        rating: 5,
        price: 420,
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        amenities: ['Free Wi-Fi', 'Pool', 'Spa', 'Restaurant'],
        description: 'Experience the magic of Paris from our luxurious hotel in the heart of the City of Light.',
        rooms: [
            {
                name: 'Deluxe King Room',
                price: 420,
                maxGuests: 2,
                bedType: 'King Bed',
                size: 42,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV']
            },
            {
                name: 'Executive Suite',
                price: 620,
                maxGuests: 2,
                bedType: 'King Bed',
                size: 62,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Private Balcony']
            }
        ]
    }
};

// Page Routes
app.get('/', (req, res) => {
    res.render('home', {
        currentPage: 'home',
        slides: [
            { title: 'Welcome to LuxeStay', description: 'Experience luxury like never before.', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
            { title: 'Discover Our Hotels', description: 'Explore our global properties.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' }
        ],
        locations: [
            { value: 'new-york', label: 'New York' },
            { value: 'london', label: 'London' },
            { value: 'paris', label: 'Paris' }
        ],
        featuredHotels: Object.values(defaultHotels).slice(0, 3),
        testimonials: [
            { rating: '★★★★★', text: 'An unforgettable stay!', author: 'John Doe' }
        ],
        attractions: [
            { name: 'Times Square', distance: '0.5 miles' }
        ]
    });
});

app.get('/home', (req, res) => {
    res.render('home', {
        currentPage: 'home',
        slides: [
            { title: 'Welcome to LuxeStay', description: 'Experience luxury like never before.', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
            { title: 'Discover Our Hotels', description: 'Explore our global properties.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' }
        ],
        locations: [
            { value: 'new-york', label: 'New York' },
            { value: 'london', label: 'London' },
            { value: 'paris', label: 'Paris' }
        ],
        featuredHotels: Object.values(defaultHotels).slice(0, 3),
        testimonials: [
            { rating: '★★★★★', text: 'An unforgettable stay!', author: 'John Doe' }
        ],
        attractions: [
            { name: 'Times Square', distance: '0.5 miles' }
        ]
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        currentPage: 'about',
        values: [
            { icon: '🏆', title: 'Excellence', description: 'Unparalleled service quality.' },
            { icon: '🌍', title: 'Global Reach', description: 'Properties worldwide.' }
        ],
        team: [
            { name: 'Jane Doe', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', description: 'CEO' },
            { name: 'John Smith', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', description: 'COO' }
        ],
        achievements: [
            { number: '50+', description: 'Hotels Worldwide' },
            { number: '10K+', description: 'Satisfied Guests' }
        ]
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        currentPage: 'contact',
        infoCards: [
            { icon: '📞', title: 'Phone Support', description: 'Call us anytime.', link: 'tel:+1-800-555-1234', linkText: '+1-800-555-1234' },
            { icon: '📧', title: 'Email Us', description: 'We reply within 24 hours.', link: 'mailto:contact@luxestayhotels.com', linkText: 'contact@luxestayhotels.com' }
        ],
        subjects: [
            { value: 'booking', label: 'Booking Inquiry' },
            { value: 'general', label: 'General Inquiry' }
        ],
        locations: [
            { name: 'Horizon New York', address: '123 5th Ave, NY', phone: '+1-800-555-1234', email: 'ny@luxestayhotels.com' }
        ],
        faqs: [
            { question: 'What is your cancellation policy?', answer: 'Free cancellation up to 24 hours before check-in.' }
        ],
        formData: {},
        errors: {}
    });
});

// Hotels page route
app.get('/hotels', async (req, res) => {
    try {
        res.render('hotels', {
            currentPage: 'hotels',
            hotels: Object.values(defaultHotels)
        });
    } catch (error) {
        console.error('Error loading hotels:', error);
        res.status(500).render('error', { 
            message: 'Error loading hotels',
            currentPage: 'hotels'
        });
    }
});

app.get('/login', (req, res) => {
    res.render('login', {
        currentPage: 'login',
        formData: {},
        errors: {}
    });
});

app.get('/register', (req, res) => {
    res.render('register', {
        currentPage: 'register',
        formData: {},
        errors: {}
    });
});

app.get('/dashboard', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        res.render('dashboard', { 
            currentPage: 'dashboard',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.redirect('/login');
    }
});

app.get('/portfolio', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        res.render('portfolio', { 
            currentPage: 'portfolio',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            hotels: Object.values(defaultHotels)
        });
    } catch (error) {
        console.error('Portfolio error:', error);
        res.redirect('/login');
    }
});

app.get('/rooms', async (req, res) => {
    try {
        const rooms = [
            {
                name: 'Deluxe King Room',
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Spacious room with city views.',
                bedType: 'King Bed',
                maxGuests: 2,
                size: 45,
                price: 299,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV']
            },
            {
                name: 'Executive Suite',
                image: 'https://images.unsplash.com/photo-1578683014728-c73504a258c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Luxury suite with private balcony.',
                bedType: 'King Bed',
                maxGuests: 2,
                size: 65,
                price: 499,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Private Balcony', 'Living Area']
            },
            {
                name: 'Family Suite',
                image: 'https://images.unsplash.com/photo-1578683014728-c73504a258c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Perfect for families with separate bedrooms.',
                bedType: '2 Queen Beds',
                maxGuests: 4,
                size: 85,
                price: 599,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Separate Bedrooms', 'Living Area']
            }
        ];

        res.render('rooms', {
            currentPage: 'rooms',
            rooms,
            amenities: ['Free Wi-Fi', '24/7 Room Service', 'Spa Access']
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        res.status(500).render('error', { 
            message: 'Error loading rooms',
            currentPage: 'rooms'
        });
    }
});

app.get('/virtual-tours', (req, res) => {
    res.render('virtual-tours', {
        currentPage: 'virtual-tours',
        properties: Object.keys(defaultHotels),
        rooms: [
            { id: 'deluxe', name: 'Deluxe King Room' },
            { id: 'suite', name: 'Executive Suite' }
        ],
        defaultTourImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    });
});

app.get('/spa', (req, res) => {
    res.render('spa', {
        currentPage: 'spa',
        treatments: [
            { name: 'Signature Massage', image: 'https://images.unsplash.com/photo-1600334085066-01599d5889cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'A 60-minute deep tissue massage.' },
            { name: 'Facial Therapy', image: 'https://images.unsplash.com/photo-1616394584738-fc647fc1ada1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'Revitalize your skin.' },
            { name: 'Hot Stone Therapy', image: 'https://images.unsplash.com/photo-1570172619644-d4f5fc6ef052?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'Warm stones and aromatherapy.' }
        ],
        packages: [
            { name: 'Day of Bliss', description: 'Full-body massage, facial, and sauna access.' },
            { name: 'Couples Retreat', description: 'Side-by-side massages and private hot tub.' },
            { name: 'Express Escape', description: '30-minute massage and mini-facial.' }
        ]
    });
});

app.get('/sustainability', (req, res) => {
    res.render('sustainability', {
        currentPage: 'sustainability',
        initiatives: [
            { title: 'Energy Efficiency', description: 'Using smart systems and LED lighting.' },
            { title: 'Water Conservation', description: 'Implementing low-flow fixtures.' }
        ]
    });
});

app.get('/dining', (req, res) => {
    res.render('dining', {
        currentPage: 'dining',
        diningVenues: [
            { name: 'The Summit', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'Horizon New York - Fine dining with city views.' },
            { name: 'Pearls & Caviar', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'Horizon Dubai - Exclusive seafood dining.' }
        ]
    });
});

app.get('/events', (req, res) => {
    res.render('events', {
        currentPage: 'events',
        eventSpaces: [
            { name: 'Grand Ballroom', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'Ideal for large weddings and galas.' },
            { name: 'Boardroom Suite', image: 'https://images.unsplash.com/photo-1516321310764-3a03cc48c0a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'Perfect for corporate meetings.' },
            { name: 'Garden Terrace', image: 'https://images.unsplash.com/photo-1590673846749-770517e8b3b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', description: 'Outdoor venue for intimate gatherings.' }
        ],
        services: [
            'Customized catering menus',
            'Audiovisual equipment setup',
            'Decor and theme coordination',
            'Transportation and accommodation packages'
        ]
    });
});

// API Endpoints
// Register User
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: 'user'
        });
        
        // Create session immediately
        req.session.userId = newUser._id;
        req.session.user = {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
        };
        
        // Save session
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Error creating session' });
            }
            
            res.status(201).json({ 
                success: true,
                message: 'User created successfully',
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Direct password comparison without hashing
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Create session
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        // Save session before sending response
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Error creating session' });
            }
            
            res.json({ 
                success: true,
                message: 'Login successful',
                redirect: '/dashboard',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Validate Token
app.get('/api/auth/validate', authenticateUser, (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Session is valid',
        user: req.session.user
    });
});

// Logout User
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('sessionId');
        res.json({ message: 'Logged out successfully' });
    });
});

// Hotel details route
app.get('/hotel/:id', async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = defaultHotels[hotelId];

        if (!hotel) {
            return res.status(404).render('not-found', { currentPage: '' });
        }

        res.render('hotel-details', {
            currentPage: 'hotels',
            hotel: hotel
        });
    } catch (error) {
        console.error('Error fetching hotel:', error);
        res.status(500).render('not-found', { currentPage: '' });
    }
});

// Booking route
app.get('/booking/:hotelId', authenticateUser, async (req, res) => {
    try {
        const hotelId = req.params.hotelId;
        const hotel = defaultHotels[hotelId];
        const selectedRoom = req.query.room || null;

        if (!hotel) {
            return res.status(404).render('not-found', { currentPage: '' });
        }

        res.render('booking', {
            currentPage: 'booking',
            hotel: hotel,
            selectedRoom: selectedRoom
        });
    } catch (error) {
        console.error('Error fetching hotel for booking:', error);
        res.status(500).render('not-found', { currentPage: '' });
    }
});

// Contact form submission API
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Create new contact entry
        const contact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        // Save to database
        await contact.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Search Rooms endpoint
app.post('/api/search-rooms', async (req, res) => {
    try {
        const { location, checkIn, checkOut, guests } = req.body;

        // Validate required fields
        if (!location || !checkIn || !checkOut || !guests) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Sample room data (in a real application, this would come from a database)
        const availableRooms = [
            {
                id: 1,
                name: 'Deluxe King Room',
                location: 'new-york',
                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Spacious room with city views.',
                bedType: 'King Bed',
                maxGuests: 2,
                size: 45,
                price: 299,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV']
            },
            {
                id: 2,
                name: 'Executive Suite',
                location: 'london',
                image: 'https://images.unsplash.com/photo-1578683014728-c73504a258c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Luxury suite with private balcony.',
                bedType: 'King Bed',
                maxGuests: 2,
                size: 65,
                price: 499,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Private Balcony', 'Living Area']
            },
            {
                id: 3,
                name: 'Family Suite',
                location: 'new-york',
                image: 'https://images.unsplash.com/photo-1578683014728-c73504a258c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Perfect for families with separate bedrooms.',
                bedType: '2 Queen Beds',
                maxGuests: 4,
                size: 85,
                price: 599,
                amenities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Smart TV', 'Separate Bedrooms', 'Living Area']
            }
        ];

        // Filter rooms based on search criteria
        const filteredRooms = availableRooms.filter(room => {
            const matchesLocation = room.location === location;
            const matchesGuests = room.maxGuests >= parseInt(guests);
            return matchesLocation && matchesGuests;
        });

        res.json({
            success: true,
            rooms: filteredRooms
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching rooms',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Create Booking API endpoint
app.post('/api/bookings', authenticateUser, async (req, res) => {
    try {
        const { hotelId, roomType, checkIn, checkOut, guests, totalPrice, specialRequests } = req.body;

        // Validate required fields
        if (!hotelId || !roomType || !checkIn || !checkOut || !guests || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Get hotel details from defaultHotels
        const hotel = defaultHotels[hotelId];
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        // Create new booking
        const booking = new Booking({
            userId: req.session.userId,
            hotelId: hotelId,
            hotelName: hotel.name,
            roomType: roomType,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: parseInt(guests),
            totalPrice: parseFloat(totalPrice),
            specialRequests: specialRequests || '',
            status: 'confirmed'
        });

        // Save booking to database
        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: {
                id: booking._id,
                hotelName: booking.hotelName,
                roomType: booking.roomType,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                totalPrice: booking.totalPrice
            }
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
});

// Get User Bookings API endpoint
app.get('/api/bookings', authenticateUser, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.session.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings: bookings.map(booking => ({
                id: booking._id,
                hotelName: booking.hotelName,
                roomType: booking.roomType,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                guests: booking.guests,
                totalPrice: booking.totalPrice,
                status: booking.status,
                createdAt: booking.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

// Get User Profile API endpoint
app.get('/api/user/profile', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's recent bookings for activity
        const recentBookings = await Booking.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentActivity = recentBookings.map(booking => ({
            type: 'booking',
            title: `Booked ${booking.hotelName}`,
            timestamp: booking.createdAt
        }));

        res.json({
            success: true,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            recentActivity: recentActivity
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile'
        });
    }
});

// Bookings page route
app.get('/bookings', authenticateUser, async (req, res) => {
    try {
        res.render('bookings', {
            currentPage: 'bookings',
            user: req.session.user
        });
    } catch (error) {
        console.error('Error loading bookings page:', error);
        res.status(500).render('error', { 
            message: 'Error loading bookings page',
            currentPage: 'bookings'
        });
    }
});

// Cancel Booking API endpoint
app.post('/api/bookings/:id/cancel', authenticateUser, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.session.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking can be cancelled (e.g., not in the past)
        const checkInDate = new Date(booking.checkIn);
        if (checkInDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel past bookings'
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('not-found', { currentPage: '' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
