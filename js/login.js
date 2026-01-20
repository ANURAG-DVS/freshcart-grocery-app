// MAIN LOGIN HANDLER CLASS
class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.customerIdInput = document.getElementById('customerId');
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
        // Load saved Customer ID if "Remember Me" was checked
        this.loadSavedCredentials();

        // Auto-focus first field
        this.customerIdInput.focus();

        // Real-time validation on blur
        this.customerIdInput.addEventListener('blur', () => {
            this.validateCustomerId();
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
        this.customerIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.passwordInput.focus();
        });

        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // Remember Me checkbox
        this.rememberMeCheckbox.addEventListener('click', () => {
            this.toggleRememberMe();
        });

        // Customer ID formatting
        this.customerIdInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase().replace(/[^CUS0-9-]/g, '');
            // Auto-format to CUS-XXXXXX
            if (value.startsWith('CUS') && value.length > 3) {
                const numbers = value.slice(3).replace(/-/g, '');
                if (numbers.length > 0) {
                    value = 'CUS-' + numbers.slice(0, 6);
                }
            }
            e.target.value = value.slice(0, 10); // CUS-XXXXXX = 10 chars
        });
    }

    loadSavedCredentials() {
        const savedId = localStorage.getItem('rememberedCustomerId');
        if (savedId) {
            this.customerIdInput.value = savedId;
            const checkbox = document.querySelector('.custom-checkbox');
            checkbox.classList.add('checked');
            this.passwordInput.focus();
        }
    }

    toggleRememberMe() {
        const checkbox = document.querySelector('.custom-checkbox');
        checkbox.classList.toggle('checked');
        
        if (!checkbox.classList.contains('checked')) {
            localStorage.removeItem('rememberedCustomerId');
        }
    }

    validateCustomerId() {
        const customerId = this.customerIdInput.value.trim();
        const isValid = /^CUS-\d{6}$/.test(customerId);

        if (customerId === '') {
            this.showFieldError(this.customerIdInput, '');
            return false;
        }

        if (!isValid) {
            this.showFieldError(this.customerIdInput, 'ID format should be CUS-123456');
            return false;
        }

        this.showFieldSuccess(this.customerIdInput);
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
        const isIdValid = this.validateCustomerId();
        const isPwdValid = this.validatePassword();

        if (!isIdValid || !isPwdValid) {
            this.showError('Please fill in all fields correctly');
            return;
        }

        const customerId = this.customerIdInput.value.trim();
        const password = this.passwordInput.value;

        // Show loading state
        this.setLoadingState(true);

        // Simulate API call delay
        await this.delay(1000);

        // Authenticate
        const result = this.authenticate(customerId, password);

        if (result.success) {
            // Save Customer ID if Remember Me is checked
            const checkbox = document.querySelector('.custom-checkbox');
            if (checkbox.classList.contains('checked')) {
                localStorage.setItem('rememberedCustomerId', customerId);
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
    }

    authenticate(customerId, password) {
        // Get registrations from localStorage
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');

        // Find customer by ID
        const customer = registrations.find(reg => reg.customerId === customerId);

        if (!customer) {
            return { success: false, error: 'Customer ID not found' };
        }

        // Get stored password (in production, this would be hashed)
        const storedPassword = localStorage.getItem(`pwd_${customerId}`);

        if (storedPassword !== password) {
            return { success: false, error: 'Incorrect password' };
        }

        return { success: true, customer };
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

// DEMO CREDENTIALS FUNCTIONALITY
function setupDemoCredentials() {
    const demoToggle = document.getElementById('demoToggle');
    const demoContent = document.getElementById('demoContent');
    const demoCustomerId = document.getElementById('demoCustomerId');

    demoToggle.addEventListener('click', () => {
        if (demoContent.classList.contains('show')) {
            demoContent.classList.remove('show');
            demoToggle.textContent = 'View Demo Credentials';
        } else {
            demoContent.classList.add('show');
            demoToggle.textContent = 'Hide Demo Credentials';
        }
    });

    // Load demo credentials
    try {
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        if (registrations.length > 0) {
            demoCustomerId.textContent = registrations[0].customerId;
        } else {
            demoCustomerId.textContent = 'Register first to get an ID';
        }
    } catch (error) {
        console.error('Error loading demo credentials:', error);
        demoCustomerId.textContent = 'CUS-123456';
    }
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
    setupDemoCredentials();
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
