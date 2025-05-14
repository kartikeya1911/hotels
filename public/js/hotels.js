document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const hotelsGrid = document.getElementById('hotelsGrid');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    let currentPage = 1;
    const hotelsPerPage = 6;
    let filteredHotels = [];

    // Add animation classes to hotel cards
    const animateCards = () => {
        const cards = document.querySelectorAll('.hotel-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in');
        });
    };

    // Filter hotels based on search and filter criteria
    const filterHotels = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const location = locationFilter.value;
        const price = priceFilter.value;
        const rating = ratingFilter.value;

        const hotelCards = document.querySelectorAll('.hotel-card');
        let visibleCount = 0;

        hotelCards.forEach(card => {
            const hotelName = card.querySelector('h3').textContent.toLowerCase();
            const hotelLocation = card.querySelector('.location').textContent.toLowerCase();
            const hotelRating = card.querySelectorAll('.fa-star').length;

            const matchesSearch = hotelName.includes(searchTerm) || 
                                hotelLocation.includes(searchTerm);
            const matchesLocation = !location || hotelLocation.includes(location);
            const matchesPrice = !price || card.classList.contains(price);
            const matchesRating = !rating || hotelRating >= parseInt(rating);

            if (matchesSearch && matchesLocation && matchesPrice && matchesRating) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show empty state if no hotels match criteria
        const emptyState = document.querySelector('.empty-state');
        if (visibleCount === 0) {
            if (!emptyState) {
                const emptyStateDiv = document.createElement('div');
                emptyStateDiv.className = 'empty-state';
                emptyStateDiv.innerHTML = `
                    <i class="fas fa-hotel"></i>
                    <p>No hotels found matching your criteria.</p>
                `;
                hotelsGrid.appendChild(emptyStateDiv);
            }
        } else if (emptyState) {
            emptyState.remove();
        }

        // Update pagination
        updatePagination(visibleCount);
    };

    // Update pagination controls
    const updatePagination = (totalHotels) => {
        const totalPages = Math.ceil(totalHotels / hotelsPerPage);
        currentPage = Math.min(currentPage, totalPages);
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        // Show/hide hotels based on current page
        const hotelCards = document.querySelectorAll('.hotel-card');
        hotelCards.forEach((card, index) => {
            if (card.style.display !== 'none') {
                const shouldShow = index >= (currentPage - 1) * hotelsPerPage && 
                                 index < currentPage * hotelsPerPage;
                card.style.display = shouldShow ? 'block' : 'none';
            }
        });
    };

    // Event listeners
    searchInput.addEventListener('input', filterHotels);
    locationFilter.addEventListener('change', filterHotels);
    priceFilter.addEventListener('change', filterHotels);
    ratingFilter.addEventListener('change', filterHotels);

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination(document.querySelectorAll('.hotel-card:not([style*="display: none"])').length);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(document.querySelectorAll('.hotel-card:not([style*="display: none"])').length / hotelsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination(document.querySelectorAll('.hotel-card:not([style*="display: none"])').length);
        }
    });

    // Initialize animations
    animateCards();

    // Add hover effects to hotel cards
    const hotelCards = document.querySelectorAll('.hotel-card');
    hotelCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
});

// Book hotel function
function bookHotel(hotelId) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Please log in to book a hotel', 'error');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return;
    }

    // Redirect to booking page
    window.location.href = `/hotel/${hotelId}/book`;
}

// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('slide-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 