document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.querySelector('input[name="remember"]').checked;
        
        try {
            // Show loading state
            const loginBtn = document.querySelector('.login-btn');
            const originalBtnText = loginBtn.textContent;
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            
            // Make API call to login endpoint
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    rememberMe
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success message
                showNotification('Login successful! Redirecting...', 'success');
                
                // Store token if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('authToken', data.token);
                } else {
                    sessionStorage.setItem('authToken', data.token);
                }
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                // Show error message
                showNotification(data.message || 'Login failed. Please try again.', 'error');
                
                // Reset button state
                loginBtn.textContent = originalBtnText;
                loginBtn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('An error occurred. Please try again.', 'error');
            
            // Reset button state
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    });
    
    // Function to show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 2rem';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideIn 0.3s ease forwards';
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#f44336';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}); 