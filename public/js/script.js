// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: 'smooth'
            });
        }
    });
});

// Hero Slider (home.html)
function initializeHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlideIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }

    function prevSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    }

    setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    document.querySelector('.hero-slider .prev')?.addEventListener('click', prevSlide);
    document.querySelector('.hero-slider .next')?.addEventListener('click', nextSlide);
    showSlide(currentSlideIndex); // Show initial slide
}

// Booking Form (home.html)
function initializeBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const location = document.getElementById('location').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const guests = document.getElementById('guests').value;

        if (!location || !checkIn || !checkOut) {
            alert('Please fill in all fields');
            return;
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate <= checkInDate) {
            alert('Check-out date must be after check-in date');
            return;
        }

        alert(`Booking submitted for ${location} from ${checkIn} to ${checkOut} for ${guests} guests`);
    });
}

// Virtual Tours (virtual-tours.html)
function initializeVirtualTours() {
    const tourButtons = document.querySelectorAll('.tour-btn');
    const tourImage = document.getElementById('tour-image');
    const images = {
        'ny-deluxe': '/images/deluxe-ny.jpg',
        'ny-suite': '/images/suite-ny.jpg',
        'london-deluxe': '/images/deluxe-london.jpg',
        'london-suite': '/images/suite-london.jpg',
        'dubai-deluxe': '/images/deluxe-dubai.jpg',
        'dubai-suite': '/images/suite-dubai.jpg'
    };
    let currentHotel = 'ny';
    let currentRoom = 'deluxe';

    tourButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tourButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.dataset.hotel) currentHotel = btn.dataset.hotel;
            if (btn.dataset.room) currentRoom = btn.dataset.room;
            tourImage.src = images[`${currentHotel}-${currentRoom}`] || images['ny-deluxe'];
        });
    });

    document.querySelector('.tour-viewer .prev-tour')?.addEventListener('click', () => {
        alert('Previous image functionality not implemented in this demo.');
    });
    document.querySelector('.tour-viewer .next-tour')?.addEventListener('click', () => {
        alert('Next image functionality not implemented in this demo.');
    });
}

// Contact Form (contact.html)
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) {
            alert('Please fill in all required fields');
            return;
        }

        alert(`Message sent from ${name} (${email}): ${message}`);
        contactForm.reset();
    });
}

// Dining Buttons (dining.html)
function initializeDiningButtons() {
    const diningButtons = document.querySelectorAll('.dining-card button');
    if (!diningButtons.length) return;

    diningButtons.forEach(button => {
        button.addEventListener('click', () => {
            const restaurant = button.parentElement.querySelector('h3').textContent;
            alert(`View menu for ${restaurant} (placeholder functionality)`);
        });
    });
}

// Authentication (login.html)
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/home.html'; // Redirect to home page
            } else {
                alert('Login failed: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed. Please try again.');
        }
    });
}

// Registration (register.html)
function initializeRegister() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !terms) {
            alert('Please fill in all fields and agree to the terms');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }), // Only email and password sent to backend
            });
            const data = await response.json();
            console.log('Register response:', data); // Log response for debugging
            if (response.ok) {
                alert('Registration successful! You can now log in.');
                window.location.href = '/home.html'; // Redirect to home page
            } else {
                alert('Registration failed: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('Registration failed due to a network error. Please try again.');
        }
    });
}

// Dashboard (dashboard.html)
function initializeDashboard() {
    const hotelForm = document.getElementById('hotelForm');
    const hotelsList = document.getElementById('hotelsList');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!hotelForm || !hotelsList || !logoutBtn) return; // Exit if not on dashboard page

    // Check authentication
    if (!localStorage.getItem('token')) {
        window.location.href = '/login.html';
        return;
    }

    // Load hotels
    async function loadHotels() {
        try {
            const response = await fetch('/api/hotels', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });
            if (!response.ok) {
                throw new Error('Failed to load hotels');
            }
            const hotels = await response.json();
            hotelsList.innerHTML = hotels.map(h => `<p>${h.name}</p>`).join('');
        } catch (err) {
            console.error('Load hotels error:', err);
            hotelsList.innerHTML = '<p>Failed to load hotels</p>';
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    }

    loadHotels(); // Initial load

    // Add hotel
    hotelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('hotelName').value;
        try {
            const response = await fetch('/api/hotels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error('Failed to add hotel');
            }
            loadHotels();
            hotelForm.reset();
        } catch (err) {
            console.error('Add hotel error:', err);
            alert('Failed to add hotel');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    });
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroSlider();
    initializeBookingForm();
    initializeVirtualTours();
    initializeContactForm();
    initializeDiningButtons();
    
    // Initialize page-specific logic
    if (window.location.pathname.endsWith('login.html')) {
        initializeLogin();
    } else if (window.location.pathname.endsWith('register.html')) {
        initializeRegister();
    } else if (window.location.pathname.endsWith('dashboard.html')) {
        initializeDashboard();
    }
});