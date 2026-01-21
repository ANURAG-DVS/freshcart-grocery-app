// Registration form validation and submission
// Validation regex patterns
const nameRegex = /^[A-Za-z\s]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const emailRegex = /@/;
const passwordRegex = {
    length: /.{5,}/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*]/
};
const contactRegex = /^\d{10}$/;

// Form state
let formValid = false;
let termsAccepted = false;

// DOM Elements
let form, customerNameInput, usernameInput, emailInput, passwordInput, addressTextarea;
let contactNumberInput, termsCheckbox, submitBtn, passwordToggle;
let strengthFill, strengthText, successModal;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    form = document.getElementById('registrationForm');
    customerNameInput = document.getElementById('customerName');
    usernameInput = document.getElementById('username');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    addressTextarea = document.getElementById('address');
    contactNumberInput = document.getElementById('contactNumber');
    termsCheckbox = document.getElementById('termsCheckbox');
    submitBtn = document.getElementById('submitBtn');
    passwordToggle = document.getElementById('passwordToggle');
    strengthFill = document.getElementById('strengthFill');
    strengthText = document.getElementById('strengthText');
    successModal = document.getElementById('successModal');

    // Setup event listeners
    setupEventListeners();
    handleFloatingLabels();
    handleCharacterCounters();
});

function setupEventListeners() {
    // Password visibility toggle
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.textContent = type === 'password' ? '👁️' : '🙈';
    });

    // Phone number formatting
    contactNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.slice(0, 10);
    });

    // Terms checkbox
    termsCheckbox.addEventListener('click', () => {
        termsAccepted = !termsAccepted;
        termsCheckbox.classList.toggle('checked', termsAccepted);
        validateForm();
    });

    // Real-time validation
    customerNameInput.addEventListener('blur', validateName);
    usernameInput.addEventListener('blur', validateUsername);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('input', () => {
        checkPasswordStrength(passwordInput.value);
    });
    passwordInput.addEventListener('blur', validatePassword);
    addressTextarea.addEventListener('blur', validateAddress);
    contactNumberInput.addEventListener('blur', validateContact);

    // Form validation on input
    [customerNameInput, usernameInput, emailInput, passwordInput, addressTextarea, contactNumberInput].forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Button ripple effect
    submitBtn.addEventListener('click', createRippleEffect);

    // Modal close handlers
    document.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('primary')) {
                window.location.href = 'home.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            window.location.href = 'login.html';
        }
    });
}

function handleFloatingLabels() {
    const inputs = document.querySelectorAll('.form-input, .form-textarea');

    inputs.forEach(input => {
        const label = input.parentElement.querySelector('.floating-label');

        function updateLabel() {
            if (input.value.trim() !== '' || input === document.activeElement) {
                label.classList.add('floated');
            } else {
                label.classList.remove('floated');
            }
        }

        input.addEventListener('focus', updateLabel);
        input.addEventListener('blur', updateLabel);
        input.addEventListener('input', updateLabel);
    });
}

function handleCharacterCounters() {
    customerNameInput.addEventListener('input', () => {
        const counter = customerNameInput.parentElement.querySelector('.char-counter');
        counter.textContent = `${customerNameInput.value.length}/50`;
    });

    usernameInput.addEventListener('input', () => {
        const counter = usernameInput.parentElement.querySelector('.char-counter');
        counter.textContent = `${usernameInput.value.length}/20`;
    });

    passwordInput.addEventListener('input', () => {
        const counter = passwordInput.parentElement.querySelector('.char-counter');
        counter.textContent = `${passwordInput.value.length}/30`;
    });

    addressTextarea.addEventListener('input', () => {
        const counter = addressTextarea.parentElement.querySelector('.char-counter');
        counter.textContent = `${addressTextarea.value.length}/100`;
    });
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 5) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 1) {
        strengthFill.style.width = '25%';
        strengthFill.style.background = '#EF4444';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#EF4444';
    } else if (strength === 2 || strength === 3) {
        strengthFill.style.width = '60%';
        strengthFill.style.background = '#F59E0B';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#F59E0B';
    } else {
        strengthFill.style.width = '100%';
        strengthFill.style.background = '#10B981';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#10B981';
    }
}

function validateField(input, regex, errorMessage) {
    const wrapper = input.parentElement.parentElement;
    const errorDiv = wrapper.querySelector('.error-message');
    const checkmark = wrapper.querySelector('.checkmark');

    if (input.value.trim() === '') {
        input.classList.remove('error', 'success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.remove('show');
        return false;
    }

    const isValid = regex.test(input.value.trim());

    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.add('show');
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        if (errorDiv) errorDiv.classList.add('show');
        if (checkmark) checkmark.classList.remove('show');
    }

    return isValid;
}

function validateName() {
    return validateField(customerNameInput, nameRegex, 'Customer Name must have alphabets only');
}

function validateUsername() {
    const username = usernameInput.value.trim();
    const wrapper = usernameInput.parentElement.parentElement;
    const errorDiv = wrapper.querySelector('.error-message');
    const checkmark = wrapper.querySelector('.checkmark');

    if (username === '') {
        usernameInput.classList.remove('error', 'success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.remove('show');
        return false;
    }

    // Check format (alphanumeric + underscore, 3-20 chars)
    if (!usernameRegex.test(username)) {
        usernameInput.classList.remove('success');
        usernameInput.classList.add('error');
        if (errorDiv) {
            errorDiv.querySelector('span:last-child').textContent = 'Username must be 3-20 characters (letters, numbers, _)';
            errorDiv.classList.add('show');
        }
        if (checkmark) checkmark.classList.remove('show');
        return false;
    }

    // Check for duplicate username (case-insensitive)
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const usernameExists = registrations.some(user =>
        user.username && user.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
        usernameInput.classList.remove('success');
        usernameInput.classList.add('error');
        if (errorDiv) {
            errorDiv.querySelector('span:last-child').textContent = 'Username already taken. Please choose another.';
            errorDiv.classList.add('show');
        }
        if (checkmark) checkmark.classList.remove('show');
        return false;
    }

    // Valid username
    usernameInput.classList.remove('error');
    usernameInput.classList.add('success');
    if (errorDiv) errorDiv.classList.remove('show');
    if (checkmark) checkmark.classList.add('show');
    return true;
}

function validateEmail() {
    return validateField(emailInput, emailRegex, 'Email id not valid');
}

function validatePassword() {
    const password = passwordInput.value;
    const isValid = passwordRegex.length.test(password) &&
        passwordRegex.uppercase.test(password) &&
        passwordRegex.number.test(password) &&
        passwordRegex.special.test(password);

    const wrapper = passwordInput.parentElement.parentElement;
    const errorDiv = wrapper.querySelector('.error-message');
    const checkmark = wrapper.querySelector('.checkmark');

    if (password.trim() === '') {
        passwordInput.classList.remove('error', 'success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.remove('show');
        return false;
    }

    if (isValid) {
        passwordInput.classList.remove('error');
        passwordInput.classList.add('success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.add('show');
    } else {
        passwordInput.classList.remove('success');
        passwordInput.classList.add('error');
        if (errorDiv) errorDiv.classList.add('show');
        if (checkmark) checkmark.classList.remove('show');
    }

    return isValid;
}

function validateAddress() {
    const isValid = addressTextarea.value.trim().length > 0 && addressTextarea.value.trim().length <= 100;
    const wrapper = addressTextarea.parentElement.parentElement;
    const errorDiv = wrapper.querySelector('.error-message');
    const checkmark = wrapper.querySelector('.checkmark');

    if (addressTextarea.value.trim() === '') {
        addressTextarea.classList.remove('error', 'success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.remove('show');
        return false;
    }

    if (isValid) {
        addressTextarea.classList.remove('error');
        addressTextarea.classList.add('success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.add('show');
    } else {
        addressTextarea.classList.remove('success');
        addressTextarea.classList.add('error');
        if (errorDiv) errorDiv.classList.add('show');
        if (checkmark) checkmark.classList.remove('show');
    }

    return isValid;
}

function validateContact() {
    const cleanNumber = contactNumberInput.value.replace(/\s/g, '');
    const isValid = contactRegex.test(cleanNumber);
    const wrapper = contactNumberInput.parentElement.parentElement;
    const errorDiv = wrapper.querySelector('.error-message');
    const checkmark = wrapper.querySelector('.checkmark');

    if (contactNumberInput.value.trim() === '') {
        contactNumberInput.classList.remove('error', 'success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.remove('show');
        return false;
    }

    if (isValid) {
        contactNumberInput.classList.remove('error');
        contactNumberInput.classList.add('success');
        if (errorDiv) errorDiv.classList.remove('show');
        if (checkmark) checkmark.classList.add('show');
    } else {
        contactNumberInput.classList.remove('success');
        contactNumberInput.classList.add('error');
        if (errorDiv) errorDiv.classList.add('show');
        if (checkmark) checkmark.classList.remove('show');
    }

    return isValid;
}

function validateForm() {
    const nameValid = customerNameInput.value.trim() !== '' && validateName();
    const usernameValid = usernameInput.value.trim() !== '' && validateUsername();
    const emailValid = emailInput.value.trim() !== '' && validateEmail();
    const passwordValid = passwordInput.value.trim() !== '' && validatePassword();
    const addressValid = addressTextarea.value.trim() !== '' && validateAddress();
    const contactValid = contactNumberInput.value.trim() !== '' && validateContact();

    formValid = nameValid && usernameValid && emailValid && passwordValid && addressValid && contactValid && termsAccepted;
    submitBtn.disabled = !formValid;
}

function generateCustomerId() {
    let customerId;
    let exists = true;

    while (exists) {
        // Generate random 6-digit number
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        customerId = `CUS-${randomNum}`;

        // Check if this ID already exists
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        exists = registrations.some(user => user.customerId === customerId);
    }

    return customerId;
}

function createConfetti() {
    const colors = ['#10B981', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        successModal.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const nameValid = validateName();
    const usernameValid = validateUsername();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    const addressValid = validateAddress();
    const contactValid = validateContact();

    const isFormValid = nameValid && usernameValid && emailValid && passwordValid && addressValid && contactValid && termsAccepted;

    if (!isFormValid) {
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="btn-loading"><div class="spinner"></div>Registering...</div>';

    try {
        const customerId = generateCustomerId();
        const formData = {
            username: usernameInput.value.trim().toLowerCase(), // Store as lowercase
            name: customerNameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            password: passwordInput.value,
            address: addressTextarea.value.trim(),
            contact: contactNumberInput.value.trim()
        };

        // Register user with secure storage
        const result = await registerUser(formData);

        if (!result.success) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-text">Create Account</span>';
            showToast(result.error, 'error');
            return;
        }

        // Update modal with form data
        document.getElementById('displayUsername').textContent = result.username;
        document.getElementById('displayName').textContent = result.name;
        document.getElementById('displayEmail').textContent = result.email;
        document.getElementById('customerId').textContent = result.customerId;

        // Show success animation first
        const successOverlay = document.getElementById('successOverlay');
        successOverlay.classList.add('show');

        // After animation, show the modal with details
        setTimeout(() => {
            successOverlay.classList.remove('show');

            // Show success modal with user details
            setTimeout(() => {
                successModal.classList.add('show');
                createConfetti();
            }, 300);
        }, 2000); // Show animation for 2 seconds

        // Reset form
        form.reset();
        document.querySelectorAll('.success, .error, .show, .checked').forEach(el => {
            el.classList.remove('success', 'error', 'show', 'checked');
        });
        document.querySelectorAll('.char-counter').forEach(counter => {
            counter.textContent = counter.textContent.replace(/\d+/, '0');
        });
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Weak';
        termsAccepted = false;
        formValid = false;

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Create Account</span>';

    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Create Account</span>';
        showToast('Registration failed. Please try again.', 'error');
        console.error('Registration error:', error);
    }
}

function createRippleEffect(e) {
    if (this.disabled) return;

    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

async function registerUser(formData) {
    // Generate unique Customer ID
    const customerId = generateCustomerId();

    // Hash password
    const hashedPassword = await hashPassword(formData.password);

    // Create user object
    const newUser = {
        customerId: customerId,
        username: formData.username.trim().toLowerCase(), // Store username
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: hashedPassword, // Store hashed password
        address: formData.address.trim(),
        contact: formData.contact.trim(),
        registeredAt: new Date().toISOString(),
        lastLogin: null
    };

    // Get existing registrations
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');

    // Check if username already exists (case-insensitive)
    const usernameExists = registrations.some(user =>
        user.username && user.username.toLowerCase() === newUser.username.toLowerCase()
    );
    if (usernameExists) {
        return {
            success: false,
            error: 'Username already taken. Please choose another.'
        };
    }

    // Check if email already exists
    const emailExists = registrations.some(user => user.email === newUser.email);
    if (emailExists) {
        return {
            success: false,
            error: 'Email already registered. Please login instead.'
        };
    }

    // Add new user to registrations array
    registrations.push(newUser);

    // Save back to localStorage
    localStorage.setItem('registrations', JSON.stringify(registrations));

    // Return success with customer ID and username
    return {
        success: true,
        customerId: customerId,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email
    };
}

// Hash password using SHA-256
async function hashPassword(password) {
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
async function simpleHash(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

// Show toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#6B7280'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 4000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    `;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Copy Customer ID to clipboard
function copyCustomerId() {
    const customerIdElement = document.getElementById('customerId');
    const customerId = customerIdElement.textContent;

    navigator.clipboard.writeText(customerId).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#059669';

        showToast('Customer ID copied to clipboard!', 'success');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#10B981';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy Customer ID', 'error');
    });
}

// Copy Username to clipboard
function copyUsername() {
    const usernameElement = document.getElementById('displayUsername');
    const username = usernameElement.textContent;

    navigator.clipboard.writeText(username).then(() => {
        const copyBtn = document.getElementById('copyUsernameBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#059669';

        showToast('Username copied to clipboard!', 'success');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#10B981';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy username', 'error');
    });
}

// Navigate to login page
function goToLogin() {
    window.location.href = 'login.html';
}
