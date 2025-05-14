// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    const dashboard = {
        modal: document.getElementById('addHotelModal'),
        addHotelBtn: document.getElementById('addHotelBtn'),
        closeModalBtn: document.querySelector('.close-modal'),
        hotelForm: document.getElementById('hotelForm'),
        hotelsGrid: document.querySelector('.hotels-grid'),
        
        init() {
            this.bindEvents();
            this.loadHotels();
        },
        
        // Helper method to get headers
        getHeaders() {
            return {
                'Content-Type': 'application/json'
            };
        },
        
        bindEvents() {
            // Modal events
            if (this.addHotelBtn) {
                this.addHotelBtn.addEventListener('click', () => this.openModal());
            }
            
            if (this.closeModalBtn) {
                this.closeModalBtn.addEventListener('click', () => this.closeModal());
            }
            
            if (this.modal) {
                window.addEventListener('click', (e) => {
                    if (e.target === this.modal) this.closeModal();
                });
            }
            
            // Form submission
            if (this.hotelForm) {
                this.hotelForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            }
        },
        
        openModal() {
            if (this.modal) {
                this.modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        },
        
        closeModal() {
            if (this.modal) {
                this.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                if (this.hotelForm) {
                    this.hotelForm.reset();
                }
            }
        },
        
        async handleFormSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.hotelForm);
            const hotelData = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitBtn = this.hotelForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            
            try {
                const response = await fetch('/api/hotels', {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: JSON.stringify(hotelData)
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to add hotel');
                }
                
                const result = await response.json();
                this.addHotelCard(result);
                this.closeModal();
                this.showNotification('Hotel added successfully!', 'success');
            } catch (error) {
                this.showNotification(error.message || 'Failed to add hotel. Please try again.', 'error');
                console.error('Error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        },
        
        async loadHotels() {
            try {
                const response = await fetch('/api/hotels', {
                    headers: this.getHeaders()
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to load hotels');
                }
                
                const hotels = await response.json();
                this.renderHotels(hotels);
            } catch (error) {
                this.showNotification(error.message || 'Failed to load hotels. Please refresh the page.', 'error');
                console.error('Error:', error);
            }
        },
        
        renderHotels(hotels) {
            if (!this.hotelsGrid) return;
            
            if (!hotels || !hotels.length) {
                this.hotelsGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-hotel"></i>
                        <p>No hotels added yet. Click the "Add Hotel" button to get started!</p>
                    </div>
                `;
                return;
            }
            
            this.hotelsGrid.innerHTML = hotels.map(hotel => this.createHotelCard(hotel)).join('');
            this.bindHotelActions();
        },
        
        createHotelCard(hotel) {
            return `
                <div class="hotel-card" data-id="${hotel._id}">
                    <div class="hotel-image">
                        <img src="${hotel.image || '/images/default-hotel.jpg'}" alt="${hotel.name}">
                    </div>
                    <div class="hotel-details">
                        <h4>${hotel.name}</h4>
                        <p>${hotel.description || 'No description available'}</p>
                        <div class="hotel-actions">
                            <button class="btn-edit" data-id="${hotel._id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" data-id="${hotel._id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindHotelActions() {
            // Add event listeners for edit and delete buttons
            const editButtons = document.querySelectorAll('.btn-edit');
            const deleteButtons = document.querySelectorAll('.btn-delete');
            
            editButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const hotelId = btn.dataset.id;
                    this.editHotel(hotelId);
                });
            });
            
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const hotelId = btn.dataset.id;
                    this.deleteHotel(hotelId);
                });
            });
        },
        
        async editHotel(hotelId) {
            try {
                const response = await fetch(`/api/hotels/${hotelId}`, {
                    headers: this.getHeaders()
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to load hotel details');
                }
                
                const hotel = await response.json();
                this.populateForm(hotel);
                this.openModal();
            } catch (error) {
                this.showNotification(error.message || 'Failed to load hotel details.', 'error');
                console.error('Error:', error);
            }
        },
        
        async deleteHotel(hotelId) {
            if (!confirm('Are you sure you want to delete this hotel?')) return;
            
            try {
                const response = await fetch(`/api/hotels/${hotelId}`, {
                    method: 'DELETE',
                    headers: this.getHeaders()
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to delete hotel');
                }
                
                const hotelCard = document.querySelector(`.hotel-card[data-id="${hotelId}"]`);
                if (hotelCard) {
                    hotelCard.remove();
                }
                
                // Check if there are any hotels left
                if (this.hotelsGrid && !this.hotelsGrid.querySelector('.hotel-card')) {
                    this.renderHotels([]);
                }
                
                this.showNotification('Hotel deleted successfully!', 'success');
            } catch (error) {
                this.showNotification(error.message || 'Failed to delete hotel.', 'error');
                console.error('Error:', error);
            }
        },
        
        populateForm(hotel) {
            if (!this.hotelForm) return;
            
            const form = this.hotelForm;
            form.name.value = hotel.name || '';
            form.description.value = hotel.description || '';
            form.image.value = hotel.image || '';
            // Add other fields as needed
        },
        
        addHotelCard(hotel) {
            if (!this.hotelsGrid) return;
            
            const card = this.createHotelCard(hotel);
            if (this.hotelsGrid.querySelector('.empty-state')) {
                this.hotelsGrid.innerHTML = '';
            }
            this.hotelsGrid.insertAdjacentHTML('afterbegin', card);
            this.bindHotelActions();
        },
        
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
    };
    
    // Initialize the dashboard
    dashboard.init();
}); 