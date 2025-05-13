// Function to handle logout
async function handleLogout() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // If no token, just clear storage and redirect
            clearAuthData();
            window.location.href = '/';
            return;
        }

        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Logged out successfully', 'success');
        } else {
            showNotification(data.message || 'Error during logout', 'error');
        }

        // Clear auth data regardless of response
        clearAuthData();
        
        // Redirect to home page
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error during logout', 'error');
        
        // Clear auth data and redirect even if there's an error
        clearAuthData();
        window.location.href = '/';
    }
}

// Function to clear authentication data
function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
}

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add animation class after a small delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add event listener to logout link
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}); 