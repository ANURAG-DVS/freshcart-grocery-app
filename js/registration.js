// Registration form validation and submission
// Validation regex patterns
const nameRegex = /^[A-Za-z\s]+$/;
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
let form, customerNameInput, emailInput, passwordInput, addressTextarea;
let contactNumberInput, termsCheckbox, submitBtn, passwordToggle;
let strengthFill, strengthText, successModal;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    form = document.getElementById('registrationForm');
    customerNameInput = document.getElementById('customerName');
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
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('input', () => {
        checkPasswordStrength(passwordInput.value);
    });
    passwordInput.addEventListener('blur', validatePassword);
    addressTextarea.addEventListener('blur', validateAddress);
    contactNumberInput.addEventListener('blur', validateContact);

    // Form validation on input
    [customerNameInput, emailInput, passwordInput, addressTextarea, contactNumberInput].forEach(input => {
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
    const emailValid = emailInput.value.trim() !== '' && validateEmail();
    const passwordValid = passwordInput.value.trim() !== '' && validatePassword();
    const addressValid = addressTextarea.value.trim() !== '' && validateAddress();
    const contactValid = contactNumberInput.value.trim() !== '' && validateContact();

    formValid = nameValid && emailValid && passwordValid && addressValid && contactValid && termsAccepted;
    submitBtn.disabled = !formValid;
}

function generateCustomerId() {
    return 'CUS-' + Math.floor(100000 + Math.random() * 900000);
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

function handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const nameValid = validateName();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    const addressValid = validateAddress();
    const contactValid = validateContact();

    const isFormValid = nameValid && emailValid && passwordValid && addressValid && contactValid && termsAccepted;

    if (!isFormValid) {
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="btn-loading"><div class="spinner"></div>Registering...</div>';

    // Simulate API call
    setTimeout(() => {
        const customerId = generateCustomerId();

        // Save to localStorage
        const registrationData = {
            customerId: customerId,
            name: customerNameInput.value.trim(),
            email: emailInput.value.trim(),
            address: addressTextarea.value.trim(),
            contact: contactNumberInput.value.trim(),
            registrationDate: new Date().toISOString()
        };

        // Save password separately (in production, hash this!)
        localStorage.setItem(`pwd_${customerId}`, passwordInput.value);

        // Save to registrations array
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        registrations.push(registrationData);
        localStorage.setItem('registrations', JSON.stringify(registrations));

        // Update modal with form data
        document.getElementById('displayName').textContent = registrationData.name;
        document.getElementById('displayEmail').textContent = registrationData.email;
        document.getElementById('customerId').textContent = `ID: #${customerId}`;

        // Show success modal
        successModal.classList.add('show');
        createConfetti();

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
    }, 2000);
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
