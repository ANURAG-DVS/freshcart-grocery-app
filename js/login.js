// MAIN LOGIN HANDLER CLASS
class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.loginButton = document.getElementById('loginBtn');
        this.errorAlert = document.getElementById('errorAlert');

        this.attemptCount = 0;
        this.maxAttempts = 3;
        this.lockoutTime = 30000; // 30 seconds
        this.isLocked = false;

        this.init();
    }

    init() {
        // Load saved username if "Remember Me" was checked
        this.loadSavedCredentials();

        // Auto-focus first field
        this.usernameInput.focus();

        // Real-time validation on blur
        this.usernameInput.addEventListener('blur', () => {
            this.validateUsername();
        });

        this.passwordInput.addEventListener('blur', () => {
            this.validatePassword();
        });

        // Caps Lock detection
        this.passwordInput.addEventListener('keyup', (e) => {
            this.detectCapsLock(e);
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Enter key support
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.passwordInput.focus();
        });

        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Remember Me checkbox
        this.rememberMeCheckbox.addEventListener('click', () => {
            this.toggleRememberMe();
        });
    }

    loadSavedCredentials() {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            this.usernameInput.value = savedUsername;
            const checkbox = document.querySelector('.custom-checkbox');
            checkbox.classList.add('checked');
            this.passwordInput.focus();
        }
    }

    toggleRememberMe() {
        const checkbox = document.querySelector('.custom-checkbox');
        checkbox.classList.toggle('checked');

        if (!checkbox.classList.contains('checked')) {
            localStorage.removeItem('rememberedUsername');
        }
    }

    validateUsername() {
        const username = this.usernameInput.value.trim();
        const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);

        if (username === '') {
            this.showFieldError(this.usernameInput, '');
            return false;
        }

        if (!isValid) {
            this.showFieldError(this.usernameInput, 'Username must be 3-20 characters (letters, numbers, _)');
            return false;
        }

        this.showFieldSuccess(this.usernameInput);
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;

        if (password === '') {
            this.showFieldError(this.passwordInput, '');
            return false;
        }

        if (password.length > 30) {
            this.showFieldError(this.passwordInput, 'Password too long (max 30 characters)');
            return false;
        }

        this.showFieldSuccess(this.passwordInput);
        return true;
    }

    showFieldError(field, message) {
        const wrapper = field.closest('.input-wrapper');
        const errorMsg = wrapper.nextElementSibling;
        const checkmark = wrapper.querySelector('.checkmark');

        field.classList.add('error');
        field.classList.remove('success');

        if (errorMsg && errorMsg.classList.contains('error-message') && message) {
            errorMsg.querySelector('span:last-child').textContent = message;
            errorMsg.classList.add('show');
        }

        if (checkmark) {
            checkmark.classList.remove('show');
        }
    }

    showFieldSuccess(field) {
        const wrapper = field.closest('.input-wrapper');
        const errorMsg = wrapper.nextElementSibling;
        const checkmark = wrapper.querySelector('.checkmark');

        field.classList.remove('error');
        field.classList.add('success');

        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.classList.remove('show');
        }

        if (checkmark) {
            checkmark.classList.add('show');
        }
    }

    detectCapsLock(event) {
        const capsLockWarning = document.getElementById('capsWarning');

        if (event.getModifierState && event.getModifierState('CapsLock')) {
            capsLockWarning.classList.add('show');
        } else {
            capsLockWarning.classList.remove('show');
        }
    }

    async handleLogin() {
        // Check if locked out
        if (this.isLocked) {
            this.showError('Too many attempts. Please wait.');
            return;
        }

        // Clear previous errors
        this.hideError();

        // Validate fields
        const isUsernameValid = this.validateUsername();
        const isPwdValid = this.validatePassword();

        if (!isUsernameValid || !isPwdValid) {
            this.showError('Please fill in all fields correctly');
            return;
        }

        const username = this.usernameInput.value.trim().toLowerCase(); // Case-insensitive
        const password = this.passwordInput.value;

        // Show loading state
        this.setLoadingState(true);

        // Simulate API call delay
        await this.delay(1000);

        try {
            // Authenticate
            const result = await this.authenticate(username, password);

            if (result.success) {
                // Save username if Remember Me is checked
                const checkbox = document.querySelector('.custom-checkbox');
                if (checkbox.classList.contains('checked')) {
                    localStorage.setItem('rememberedUsername', username);
                }

                // Save current user session
                localStorage.setItem('currentUser', JSON.stringify(result.customer));

                // Show success animation
                this.showSuccessAnimation();
            } else {
                this.setLoadingState(false);
                this.attemptCount++;

                // Check if should lock out
                if (this.attemptCount >= this.maxAttempts) {
                    this.lockout();
                } else {
                    this.showError(result.error);
                }
            }
        } catch (error) {
            this.setLoadingState(false);
            this.showError('Authentication failed. Please try again.');
            console.error('Authentication error:', error);
        }
    }

    authenticate(username, password) {
        // Get registrations from localStorage
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');

        // Find customer by username (case-insensitive)
        const customer = registrations.find(reg =>
            reg.username && reg.username.toLowerCase() === username.toLowerCase()
        );

        if (!customer) {
            return { success: false, error: 'Username not found' };
        }

        // Get stored password (SHA-256 hashed)
        const storedPasswordHash = customer.password;

        // Hash input password for comparison
        return this.hashPassword(password).then(inputHash => {
            if (storedPasswordHash !== inputHash) {
                return { success: false, error: 'Password not valid' };
            }

            // Update last login time
            customer.lastLogin = new Date().toISOString();

            // Save updated customer data
            const updatedRegistrations = registrations.map(reg =>
                reg.username && reg.username.toLowerCase() === username.toLowerCase() ? customer : reg
            );
            localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));

            // Return session data
            const sessionUser = {
                customerId: customer.customerId,
                username: customer.username,
                name: customer.name,
                email: customer.email,
                contact: customer.contact,
                address: customer.address,
                loginTime: new Date().toISOString()
            };

            return { success: true, customer: sessionUser };
        });
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.loginButton.disabled = true;
            this.loginButton.innerHTML = '<div class="btn-loading"><div class="spinner"></div>Logging in...</div>';
        } else {
            this.loginButton.disabled = false;
            this.loginButton.innerHTML = '<span class="btn-text">Login to Account</span>';
        }
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        this.errorAlert.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => this.hideError(), 5000);
    }

    hideError() {
        this.errorAlert.classList.remove('show');
    }

    lockout() {
        this.isLocked = true;
        this.loginButton.disabled = true;

        let timeLeft = this.lockoutTime / 1000;
        this.showError(`Too many failed attempts. Try again in ${timeLeft} seconds`);

        const countdown = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                this.showError(`Too many failed attempts. Try again in ${timeLeft} seconds`);
            } else {
                clearInterval(countdown);
                this.isLocked = false;
                this.attemptCount = 0;
                this.loginButton.disabled = false;
                this.hideError();
            }
        }, 1000);
    }

    showSuccessAnimation() {
        const successOverlay = document.getElementById('successOverlay');
        successOverlay.classList.add('show');

        // Create confetti
        this.createConfetti(successOverlay);

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
    }

    createConfetti(container) {
        const colors = ['#10B981', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Hash password using SHA-256
    async hashPassword(password) {
        try {
            // Check if crypto.subtle is available
            if (!crypto || !crypto.subtle) {
                console.warn('crypto.subtle not available, using fallback hashing');
                // Fallback: simple hash for demo purposes (NOT secure for production!)
                return await simpleHash(password);
            }

            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error('Error hashing password:', error);
            // Fallback to simple hash
            return await simpleHash(password);
        }
    }

    // Simple fallback hash (NOT secure - for demo only!)
    async simpleHash(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }
}

// PASSWORD TOGGLE FUNCTIONALITY
function setupPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('passwordToggle');

    toggleBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
        }
    });
}

// BUTTON RIPPLE EFFECT
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// SET TIME-BASED GREETING
function setGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    if (hour >= 17) greeting = 'Good Evening';

    document.getElementById('timeGreeting').textContent = greeting;
}

// INITIALIZE WHEN DOM IS READY
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
    setupPasswordToggle();
    setGreeting();

    // Add ripple effect to login button
    document.getElementById('loginBtn').addEventListener('click', createRipple);

    // Social login placeholders
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Social login feature coming soon!');
        });
    });
});
