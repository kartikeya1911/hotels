document.addEventListener('DOMContentLoaded', () => {
    // Get all filter buttons and room cards
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');
    
    // Booking Modal Elements
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBookingBtn = document.getElementById('cancelBooking');
    const confirmBookingBtn = document.getElementById('confirmBooking');
    const bookingForm = document.getElementById('bookingForm');
    const roomTypeInput = document.getElementById('roomType');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const guestsInput = document.getElementById('guests');
    const roomCountInput = document.getElementById('roomCount');
    const specialRequestsInput = document.getElementById('specialRequests');

    // Room prices configuration
    const roomPrices = {
        'deluxe': 200,
        'suite': 350,
        'executive': 500,
        'presidential': 800
    };

    // Initialize date inputs with min date as today
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkOutInput.min = today;

    // Update checkout min date when check-in is selected
    checkInInput.addEventListener('change', () => {
        checkOutInput.min = checkInInput.value;
        if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
            checkOutInput.value = checkInInput.value;
        }
        updateBookingSummary();
    });

    // Update booking summary when any input changes
    [roomTypeInput, checkInInput, checkOutInput, guestsInput, roomCountInput].forEach(input => {
        input.addEventListener('change', updateBookingSummary);
    });

    // Calculate and update booking summary
    function updateBookingSummary() {
        const roomType = roomTypeInput.value;
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        const guests = guestsInput.value;
        const roomCount = roomCountInput.value;

        if (roomType && checkInInput.value && checkOutInput.value && guests && roomCount) {
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            const pricePerNight = roomPrices[roomType.toLowerCase()];
            const total = nights * pricePerNight * parseInt(roomCount);

            document.getElementById('summaryRoomType').textContent = roomType;
            document.getElementById('summaryCheckIn').textContent = checkIn.toLocaleDateString();
            document.getElementById('summaryCheckOut').textContent = checkOut.toLocaleDateString();
            document.getElementById('summaryNights').textContent = nights;
            document.getElementById('summaryGuests').textContent = guests;
            document.getElementById('summaryRooms').textContent = roomCount;
            document.getElementById('summaryTotal').textContent = `$${total}`;
        }
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = [roomTypeInput, checkInInput, checkOutInput, guestsInput, roomCountInput];

        // Reset previous error states
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate dates
        if (checkInInput.value && checkOutInput.value) {
            const checkIn = new Date(checkInInput.value);
            const checkOut = new Date(checkOutInput.value);
            if (checkOut <= checkIn) {
                showError(checkOutInput, 'Check-out date must be after check-in date');
                isValid = false;
            }
        }

        return isValid;
    }

    // Show error message
    function showError(input, message) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        
        const title = document.createElement('div');
        title.className = 'notification-title';
        title.textContent = type === 'success' ? 'Success!' : 'Error!';
        
        const text = document.createElement('div');
        text.className = 'notification-message';
        text.textContent = message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => notification.remove();
        
        content.appendChild(title);
        content.appendChild(text);
        notification.appendChild(icon);
        notification.appendChild(content);
        notification.appendChild(closeBtn);
        
        document.body.appendChild(notification);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Handle form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const submitButton = confirmBookingBtn;
        const buttonText = submitButton.querySelector('.button-text');
        const spinner = submitButton.querySelector('.loading-spinner');

        // Show loading state
        buttonText.textContent = 'Processing...';
        spinner.style.display = 'block';
        submitButton.disabled = true;

        const formData = {
            roomType: roomTypeInput.value,
            checkIn: checkInInput.value,
            checkOut: checkOutInput.value,
            guests: guestsInput.value,
            roomCount: roomCountInput.value,
            specialRequests: specialRequestsInput.value,
            totalPrice: document.getElementById('summaryTotal').textContent
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Booking confirmed successfully!');
                bookingForm.reset();
                closeBookingModal();
            } else {
                showNotification(data.message || 'Failed to book room. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('An error occurred. Please try again.', 'error');
        } finally {
            // Reset button state
            buttonText.textContent = 'Confirm Booking';
            spinner.style.display = 'none';
            submitButton.disabled = false;
        }
    });

    // Modal functionality
    function openBookingModal(roomType) {
        roomTypeInput.value = roomType;
        bookingModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateBookingSummary();
    }

    function closeBookingModal() {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        bookingForm.reset();
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    // Event listeners for modal
    closeModal.addEventListener('click', closeBookingModal);
    cancelBookingBtn.addEventListener('click', closeBookingModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });

    // Add event listeners to book now buttons
    document.querySelectorAll('.book-now-btn').forEach(button => {
        button.addEventListener('click', () => {
            const roomType = button.closest('.room-card').querySelector('h3').textContent;
            openBookingModal(roomType);
        });
    });

    // Filter functionality
    const priceRangeSelect = document.getElementById('priceRange');

    function filterRooms() {
        const selectedType = roomTypeInput.value;
        const selectedPrice = priceRangeSelect.value;
        const selectedGuests = guestsInput.value;

        roomCards.forEach(card => {
            const roomType = card.querySelector('h3').textContent.toLowerCase();
            const price = parseInt(card.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
            const guests = parseInt(card.querySelector('.room-features span:nth-child(2)').textContent.match(/\d+/)[0]);

            const matchesType = !selectedType || roomType.includes(selectedType.toLowerCase());
            const matchesPrice = !selectedPrice || checkPriceRange(price, selectedPrice);
            const matchesGuests = !selectedGuests || (selectedGuests === '3+' ? guests >= 3 : guests === parseInt(selectedGuests));

            card.style.display = matchesType && matchesPrice && matchesGuests ? 'block' : 'none';
        });
    }

    function checkPriceRange(price, range) {
        const [min, max] = range.split('-').map(Number);
        if (max) {
            return price >= min && price <= max;
        } else {
            return price >= min;
        }
    }

    roomTypeInput.addEventListener('change', filterRooms);
    priceRangeSelect.addEventListener('change', filterRooms);

    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });

    // Add CSS for notifications and modal
    const style = document.createElement('style');
    style.textContent = `
        /* Booking Modal Styles */
        .booking-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        .modal-content {
            background: white;
            padding: 2.5rem;
            border-radius: 20px;
            width: 90%;
            max-width: 800px;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: modalSlideIn 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f0f0f0;
        }

        .modal-header h2 {
            font-size: 2rem;
            color: #2c3e50;
            font-weight: 700;
            margin: 0;
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 1.8rem;
            color: #666;
            cursor: pointer;
            padding: 0.5rem;
            transition: all 0.3s ease;
        }

        .close-modal:hover {
            color: #e74c3c;
            transform: rotate(90deg);
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        .form-group label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 1.1rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 1rem;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            width: 100%;
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
            outline: none;
        }

        .booking-summary {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
        }

        .booking-summary h3 {
            font-size: 1.4rem;
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e9ecef;
        }

        .summary-item.total {
            grid-column: 1 / -1;
            font-weight: 700;
            color: #2c3e50;
            font-size: 1.2rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid #e9ecef;
            border-bottom: none;
        }

        .modal-footer {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }

        .btn {
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            font-size: 1.1rem;
            flex: 1;
            text-align: center;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        .btn-outline {
            background-color: transparent;
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
        }

        .btn-outline:hover {
            background-color: var(--primary-color);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        .loading-spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes modalSlideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        /* Error States */
        .error {
            border-color: #e74c3c !important;
        }

        .error-message {
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 4px;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
            .modal-content {
                padding: 1.5rem;
                width: 95%;
            }

            .modal-header h2 {
                font-size: 1.5rem;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .summary-grid {
                grid-template-columns: 1fr;
            }

            .modal-footer {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}); 