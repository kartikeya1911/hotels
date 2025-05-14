/**
 * LuxeStay Hotels - Main JavaScript
 * A comprehensive JavaScript implementation for the LuxeStay Hotels website
 */

// ============================================================================
// DOM Elements
// ============================================================================
const elements = {
    // Navigation
    navbar: document.querySelector('.navbar'),
    mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
    navbarMenu: document.querySelector('.navbar-menu'),
    navLinks: document.querySelectorAll('.nav-links a'),
    
    // Forms
    bookingForm: document.getElementById('booking-form'),
    contactForm: document.getElementById('contact-form'),
    newsletterForm: document.getElementById('newsletter-form'),
    searchForm: document.getElementById('search-form'),
    
    // Sliders and Galleries
    heroSlider: document.querySelector('.hero-slider'),
    imageGallery: document.querySelector('.image-gallery'),
    virtualTours: document.querySelector('.virtual-tours'),
    
    // Interactive Elements
    diningButtons: document.querySelectorAll('.dining-btn'),
    roomFilters: document.querySelectorAll('.room-filter'),
    hotelFilters: document.querySelectorAll('.hotel-filter'),
    paginationButtons: document.querySelectorAll('.pagination-btn'),
    
    // Content Areas
    hotelList: document.querySelector('.hotel-list'),
    roomList: document.querySelector('.room-list'),
    
    // Modals and Overlays
    modals: document.querySelectorAll('.modal'),
    modalCloseButtons: document.querySelectorAll('.modal-close'),
    
    // All forms for validation
    allForms: document.querySelectorAll('form')
};

// ============================================================================
// Utility Functions
// ============================================================================
const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance optimization
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format currency with locale support
    formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format date with locale support
    formatDate: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
            .format(new Date(date));
    },

    // Show notification with customizable options
    showNotification: (message, type = 'success', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add animation class after a small delay
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    },

    // Validate email format
    validateEmail: (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    // Get URL parameters
    getUrlParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        return result;
    },

    // Set URL parameters
    setUrlParams: (params) => {
        const url = new URL(window.location.href);
        Object.keys(params).forEach(key => {
            url.searchParams.set(key, params[key]);
        });
        window.history.pushState({}, '', url);
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Lazy load images
    lazyLoadImages: () => {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// ============================================================================
// Navigation Module
// ============================================================================
const navigation = {
    init: () => {
        // Handle scroll effect
        window.addEventListener('scroll', utils.throttle(() => {
            if (window.scrollY > 50) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }
        }, 100));

        // Handle mobile menu
        if (elements.mobileMenuToggle && elements.navbarMenu) {
            elements.mobileMenuToggle.addEventListener('click', () => {
                elements.navbarMenu.classList.toggle('active');
                elements.mobileMenuToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (elements.navbarMenu && 
                elements.navbarMenu.classList.contains('active') && 
                !elements.navbarMenu.contains(e.target) && 
                !elements.mobileMenuToggle.contains(e.target)) {
                elements.navbarMenu.classList.remove('active');
                elements.mobileMenuToggle.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on a link
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (elements.navbarMenu && elements.navbarMenu.classList.contains('active')) {
                    elements.navbarMenu.classList.remove('active');
                    elements.mobileMenuToggle.classList.remove('active');
        }
    });
});

        // Add active class to current page link
        const currentPage = window.location.pathname;
        elements.navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.parentElement.classList.add('active');
            }
        });

        // Handle dropdown menus
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle active class on the button
                toggle.classList.toggle('active');
                
                // Find the dropdown menu
                const dropdown = toggle.closest('.user-menu').querySelector('.dropdown-menu');
                dropdown.classList.toggle('show');
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    if (menu !== dropdown) {
                        menu.classList.remove('show');
                        const otherToggle = menu.closest('.user-menu').querySelector('.dropdown-toggle');
                        if (otherToggle) {
                            otherToggle.classList.remove('active');
                        }
                    }
                });
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                    const toggle = menu.closest('.user-menu').querySelector('.dropdown-toggle');
                    if (toggle) {
                        toggle.classList.remove('active');
                    }
                });
            }
        });

        // Handle language selector
        const languageSelector = document.querySelector('.language-selector select');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                const language = e.target.value;
                // Here you would typically redirect to the localized version
                // or update the page content based on the selected language
                utils.showNotification(`Language changed to ${language}`);
            });
        }
    }
};

// ============================================================================
// Forms Module
// ============================================================================
const forms = {
    init: () => {
        // Booking form
        if (elements.bookingForm) {
            elements.bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!elements.bookingForm.checkValidity()) {
                    e.stopPropagation();
                    elements.bookingForm.classList.add('was-validated');
                    return;
                }
                
                const formData = new FormData(elements.bookingForm);
                const bookingData = Object.fromEntries(formData.entries());
                
                try {
                    // Show loading state
                    const submitBtn = elements.bookingForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Processing...';
                    
                    const response = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(bookingData)
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        utils.showNotification('Booking successful!');
                        elements.bookingForm.reset();
                        
                        // Redirect to confirmation page if URL is provided
                        if (data.redirectUrl) {
                            window.location.href = data.redirectUrl;
                        }
                    } else {
                        utils.showNotification(data.message || 'Booking failed', 'error');
                    }
                } catch (error) {
                    utils.showNotification('An error occurred while processing your booking', 'error');
                    console.error('Booking error:', error);
                } finally {
                    // Reset button state
                    const submitBtn = elements.bookingForm.querySelector('button[type="submit"]');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
            
            // Initialize date pickers if they exist
            const dateInputs = elements.bookingForm.querySelectorAll('input[type="date"]');
            if (dateInputs.length > 0) {
                // Set min date to today
                const today = new Date().toISOString().split('T')[0];
                dateInputs.forEach(input => {
                    input.min = today;
                });
                
                // Set check-out min date based on check-in date
                const checkInInput = elements.bookingForm.querySelector('input[name="checkIn"]');
                const checkOutInput = elements.bookingForm.querySelector('input[name="checkOut"]');
                
                if (checkInInput && checkOutInput) {
                    checkInInput.addEventListener('change', () => {
                        checkOutInput.min = checkInInput.value;
                        
                        // If check-out is before check-in, update it
                        if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
                            const checkInDate = new Date(checkInInput.value);
                            const nextDay = new Date(checkInDate);
                            nextDay.setDate(nextDay.getDate() + 1);
                            checkOutInput.value = nextDay.toISOString().split('T')[0];
                        }
                    });
                }
            }
        }

        // Contact form
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!elements.contactForm.checkValidity()) {
                    e.stopPropagation();
                    elements.contactForm.classList.add('was-validated');
            return;
        }

                const formData = new FormData(elements.contactForm);
                const contactData = Object.fromEntries(formData.entries());
                
                try {
                    // Show loading state
                    const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                    
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(contactData)
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        utils.showNotification('Message sent successfully!');
                        elements.contactForm.reset();
                    } else {
                        utils.showNotification(data.message || 'Failed to send message', 'error');
                    }
                } catch (error) {
                    utils.showNotification('An error occurred while sending your message', 'error');
                    console.error('Contact form error:', error);
                } finally {
                    // Reset button state
                    const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }

        // Newsletter form
        if (elements.newsletterForm) {
            elements.newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

                if (!elements.newsletterForm.checkValidity()) {
                    e.stopPropagation();
                    elements.newsletterForm.classList.add('was-validated');
                    return;
                }

                const emailInput = elements.newsletterForm.querySelector('input[type="email"]');
                const email = emailInput.value;

                if (!utils.validateEmail(email)) {
                    utils.showNotification('Please enter a valid email address', 'error');
            return;
        }

                try {
                    // Show loading state
                    const submitBtn = elements.newsletterForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Subscribing...';
                    
                    const response = await fetch('/api/newsletter', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        utils.showNotification('Subscribed successfully!');
                        elements.newsletterForm.reset();
                    } else {
                        utils.showNotification(data.message || 'Subscription failed', 'error');
                    }
                } catch (error) {
                    utils.showNotification('An error occurred while subscribing', 'error');
                    console.error('Newsletter error:', error);
                } finally {
                    // Reset button state
                    const submitBtn = elements.newsletterForm.querySelector('button[type="submit"]');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }

        // Search form
        if (elements.searchForm) {
            elements.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const searchInput = elements.searchForm.querySelector('input[type="search"]');
                const searchTerm = searchInput.value.trim();
                
                if (searchTerm) {
                    // Redirect to search results page
                    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
                }
            });
        }

        // Form validation for all forms
        elements.allForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
        e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.hasAttribute('required') && !input.value) {
                        input.classList.add('is-invalid');
            } else {
                        input.classList.remove('is-invalid');
                    }
                    
                    // Email validation
                    if (input.type === 'email' && input.value && !utils.validateEmail(input.value)) {
                        input.classList.add('is-invalid');
                    }
                });
            });
        });
    }
};

// ============================================================================
// Sliders and Galleries Module
// ============================================================================
const sliders = {
    init: () => {
        // Hero Slider
        if (elements.heroSlider) {
            const heroSlider = {
                currentSlide: 0,
                slides: elements.heroSlider.querySelectorAll('.slide'),
                indicators: elements.heroSlider.querySelectorAll('.slider-indicator'),
                prevButton: elements.heroSlider.querySelector('.slider-prev'),
                nextButton: elements.heroSlider.querySelector('.slider-next'),
                autoSlideInterval: null,
                autoSlideDelay: 5000, // 5 seconds

                init() {
                    if (!this.slides.length) return;

                    // Add event listeners
                    this.prevButton.addEventListener('click', () => this.prevSlide());
                    this.nextButton.addEventListener('click', () => this.nextSlide());
                    
                    // Add click events to indicators
                    this.indicators.forEach((indicator, index) => {
                        indicator.addEventListener('click', () => this.goToSlide(index));
                    });

                    // Start auto-slide
                    this.startAutoSlide();

                    // Pause auto-slide on hover
                    const slider = elements.heroSlider;
                    slider.addEventListener('mouseenter', () => this.stopAutoSlide());
                    slider.addEventListener('mouseleave', () => this.startAutoSlide());

                    // Handle touch events for mobile
                    let touchStartX = 0;
                    let touchEndX = 0;

                    slider.addEventListener('touchstart', (e) => {
                        touchStartX = e.changedTouches[0].screenX;
                        this.stopAutoSlide();
                    }, { passive: true });

                    slider.addEventListener('touchend', (e) => {
                        touchEndX = e.changedTouches[0].screenX;
                        this.handleSwipe();
                        this.startAutoSlide();
                    }, { passive: true });
                },

                handleSwipe() {
                    const swipeThreshold = 50;
                    const diff = touchStartX - touchEndX;

                    if (Math.abs(diff) > swipeThreshold) {
                        if (diff > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    }
                },

                goToSlide(index) {
                    // Remove active class from current slide and indicator
                    this.slides[this.currentSlide].classList.remove('active');
                    this.indicators[this.currentSlide].classList.remove('active');

                    // Update current slide index
                    this.currentSlide = index;

                    // Add active class to new slide and indicator
                    this.slides[this.currentSlide].classList.add('active');
                    this.indicators[this.currentSlide].classList.add('active');
                },

                nextSlide() {
                    const nextIndex = (this.currentSlide + 1) % this.slides.length;
                    this.goToSlide(nextIndex);
                },

                prevSlide() {
                    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
                    this.goToSlide(prevIndex);
                },

                startAutoSlide() {
                    if (this.autoSlideInterval) return;
                    this.autoSlideInterval = setInterval(() => this.nextSlide(), this.autoSlideDelay);
                },

                stopAutoSlide() {
                    if (this.autoSlideInterval) {
                        clearInterval(this.autoSlideInterval);
                        this.autoSlideInterval = null;
                    }
                }
            };

            // Initialize the hero slider
            heroSlider.init();
        }
        
        // Image Gallery
        if (elements.imageGallery) {
            const galleryImages = elements.imageGallery.querySelectorAll('.gallery-image');
            const mainImage = elements.imageGallery.querySelector('.main-image img');
            
            if (mainImage && galleryImages.length > 0) {
                galleryImages.forEach(img => {
                    img.addEventListener('click', () => {
                        // Update main image
                        mainImage.src = img.src;
                        
                        // Update active state
                        galleryImages.forEach(i => i.classList.remove('active'));
                        img.classList.add('active');
                    });
                });
            }
        }
        
        // Virtual Tours
        if (elements.virtualTours) {
            const tours = elements.virtualTours.querySelectorAll('.tour');
            let currentTour = 0;
            
            const showTour = (index) => {
                tours.forEach((tour, i) => {
                    tour.classList.toggle('active', i === index);
                });
            };
            
            const tourButtons = elements.virtualTours.querySelectorAll('.tour-btn');
            tourButtons.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    currentTour = index;
                    showTour(currentTour);
                });
            });
        }
    }
};

// ============================================================================
// Interactive Elements Module
// ============================================================================
const interactive = {
    init: () => {
        // Dining buttons
        if (elements.diningButtons) {
            elements.diningButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const restaurant = btn.dataset.restaurant;
                    // Handle restaurant selection
                    utils.showNotification(`Selected ${restaurant}`);
                    
                    // Update active state
                    elements.diningButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
        
        // Room filters
        if (elements.roomFilters) {
            elements.roomFilters.forEach(filter => {
                filter.addEventListener('click', () => {
                    const category = filter.dataset.category;
                    
                    // Update active state
                    elements.roomFilters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');
                    
                    // Filter rooms
                    const rooms = document.querySelectorAll('.room-card');
                    rooms.forEach(room => {
                        if (category === 'all' || room.dataset.category === category) {
                            room.style.display = 'block';
            } else {
                            room.style.display = 'none';
                        }
                    });
                });
            });
        }
        
        // Hotel filters
        if (elements.hotelFilters) {
            elements.hotelFilters.forEach(filter => {
                filter.addEventListener('change', () => {
                    const filterType = filter.dataset.filter;
                    const filterValue = filter.value;
                    
                    // Update URL parameters
                    const params = utils.getUrlParams();
                    params[filterType] = filterValue;
                    utils.setUrlParams(params);
                    
                    // Apply filters (this would typically trigger a page reload or AJAX request)
                    utils.showNotification(`Filtering by ${filterType}: ${filterValue}`);
                });
            });
        }
        
        // Pagination
        if (elements.paginationButtons) {
            elements.paginationButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const page = btn.dataset.page;
                    
                    // Update active state
                    elements.paginationButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update URL and reload page
                    const params = utils.getUrlParams();
                    params.page = page;
                    utils.setUrlParams(params);
                    window.location.reload();
                });
            });
        }

        // Modals
        if (elements.modals) {
            // Open modal
            document.querySelectorAll('[data-modal]').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modalId = trigger.dataset.modal;
                    const modal = document.getElementById(modalId);
                    
                    if (modal) {
                        modal.classList.add('show');
                        document.body.classList.add('modal-open');
                    }
                });
            });
            
            // Close modal
            elements.modalCloseButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const modal = btn.closest('.modal');
                    if (modal) {
                        modal.classList.remove('show');
                        document.body.classList.remove('modal-open');
                    }
                });
            });
            
            // Close modal when clicking outside
            elements.modals.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('show');
                        document.body.classList.remove('modal-open');
                    }
                });
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const openModal = document.querySelector('.modal.show');
                    if (openModal) {
                        openModal.classList.remove('show');
                        document.body.classList.remove('modal-open');
                    }
                }
            });
        }
    }
};

// ============================================================================
// Hotel Listings Module
// ============================================================================
const hotelListings = {
    init: () => {
        if (!elements.hotelList) return;
        
        // Handle hotel card hover effects
        const hotelCards = elements.hotelList.querySelectorAll('.hotel-card');
        hotelCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
            });
        });
        
        // Handle "View Details" button clicks
        const viewButtons = elements.hotelList.querySelectorAll('.view-details');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
        e.preventDefault();
                const hotelId = btn.dataset.hotelId;
                window.location.href = `/hotel/${hotelId}`;
            });
        });
    }
};

// ============================================================================
// Room Listings Module
// ============================================================================
const roomListings = {
    init: () => {
        if (!elements.roomList) return;
        
        // Handle room card hover effects
        const roomCards = elements.roomList.querySelectorAll('.room-card');
        roomCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover');
            });
        });
        
        // Handle "Book Now" button clicks
        const bookButtons = elements.roomList.querySelectorAll('.book-now');
        bookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const roomId = btn.dataset.roomId;
                window.location.href = `/booking?room=${roomId}`;
            });
        });
    }
};

// ============================================================================
// Smooth Scroll
// ============================================================================
const smoothScroll = {
    init: () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Offset for fixed navbar
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ============================================================================
// Initialize All Modules
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    navigation.init();
    forms.init();
    sliders.init();
    interactive.init();
    hotelListings.init();
    roomListings.init();
    smoothScroll.init();
    
    // Initialize lazy loading
    utils.lazyLoadImages();
    
    // Add animation classes to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            if (utils.isInViewport(element)) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', utils.throttle(animateOnScroll, 100));
});