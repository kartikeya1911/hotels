document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (!username || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // After successful registration, automatically log in
                    try {
                        const loginResponse = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email,
                                password
                            })
                        });
                        
                        const loginData = await loginResponse.json();
                        
                        if (loginResponse.ok) {
                            // Store the token
                            localStorage.setItem('token', loginData.token);
                            showNotification('Registration successful! Redirecting to dashboard...', 'success');
                            setTimeout(() => {
                                window.location.href = '/dashboard';
                            }, 1500);
                        } else {
                            showNotification('Registration successful! Please log in.', 'success');
                            setTimeout(() => {
                                window.location.href = '/login';
                            }, 1500);
                        }
                    } catch (loginError) {
                        console.error('Auto-login error:', loginError);
                        showNotification('Registration successful! Please log in.', 'success');
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 1500);
                    }
                } else {
                    showNotification(data.message || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('An error occurred during registration', 'error');
            }
        });
    }
});

function showNotification(message, type = 'info') {
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