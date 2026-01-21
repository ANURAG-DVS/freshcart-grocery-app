// Home page - Product catalog and shopping cart
let currentUser = null;
let products = [];
let cart = [];
let filteredProducts = [];
let currentCategory = 'all';

// Sample products data
const sampleProducts = [
    { id: 1, name: "Fresh Organic Bananas", category: "fruits", weight: "1 kg", price: 60, originalPrice: 80, discount: 25, image: "🍌", rating: 4.5, stock: 50 },
    { id: 2, name: "Farm Fresh Tomatoes", category: "vegetables", weight: "500g", price: 40, originalPrice: 50, discount: 20, image: "🍅", rating: 4.2, stock: 30 },
    { id: 3, name: "Whole Milk", category: "dairy", weight: "1L", price: 65, originalPrice: 70, discount: 7, image: "🥛", rating: 4.3, stock: 25 },
    { id: 4, name: "Mixed Nuts", category: "snacks", weight: "200g", price: 180, originalPrice: 200, discount: 10, image: "🥜", rating: 4.6, stock: 15 },
    { id: 5, name: "Orange Juice", category: "beverages", weight: "1L", price: 120, originalPrice: 140, discount: 14, image: "🧃", rating: 4.1, stock: 20 },
    { id: 6, name: "Whole Wheat Bread", category: "bakery", weight: "400g", price: 45, originalPrice: 45, discount: 0, image: "🍞", rating: 4.7, stock: 0 },
    { id: 7, name: "Green Apples", category: "fruits", weight: "1 kg", price: 120, originalPrice: 140, discount: 14, image: "🍏", rating: 4.4, stock: 35 },
    { id: 8, name: "Broccoli", category: "vegetables", weight: "500g", price: 55, originalPrice: 65, discount: 15, image: "🥦", rating: 4.0, stock: 18 },
    { id: 9, name: "Greek Yogurt", category: "dairy", weight: "200g", price: 85, originalPrice: 95, discount: 11, image: "🥛", rating: 4.5, stock: 22 },
    { id: 10, name: "Dark Chocolate", category: "snacks", weight: "100g", price: 95, originalPrice: 110, discount: 14, image: "🍫", rating: 4.3, stock: 12 },
    { id: 11, name: "Green Tea", category: "beverages", weight: "25 bags", price: 150, originalPrice: 170, discount: 12, image: "🍵", rating: 4.2, stock: 8 },
    { id: 12, name: "Croissants", category: "bakery", weight: "4 pieces", price: 120, originalPrice: 140, discount: 14, image: "🥐", rating: 4.8, stock: 6 }
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadProducts();
    loadCart();
    setupEventListeners();
    updateWelcomeMessage();
    renderProducts();
    updateCartDisplay();
});

function loadUserData() {
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            // No active session - redirect to login
            window.location.href = 'login.html';
            return;
        }

        // Validate session data
        if (!currentUser.customerId || !currentUser.name || !currentUser.email) {
            // Invalid session data - clear and redirect
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
            return;
        }

        // Update UI with user data
        document.getElementById('userName').textContent = currentUser.name.split(' ')[0];
        document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();

    } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

function updateWelcomeMessage() {
    if (currentUser) {
        const firstName = currentUser.name.split(' ')[0];
        document.getElementById('welcomeTitle').textContent = `Hello ${firstName}, Welcome to FreshCart!`;
    }
}

function loadProducts() {
    products = sampleProducts;
    filteredProducts = [...products];
}

function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));

    // Category filters
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => filterByCategory(item.dataset.category));
    });

    // Navbar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    filteredProducts = query === '' ? [...products] : products.filter(p =>
        p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
    renderProducts();
}

function filterByCategory(category) {
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    currentCategory = category;
    filteredProducts = category === 'all' ? [...products] : products.filter(p => p.category === category);
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    filteredProducts.forEach((product, index) => {
        const card = createProductCard(product);
        grid.appendChild(card);
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.5s ease';

    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    card.innerHTML = `
        <div class="product-image">
            <span style="font-size: 48px;">${product.image}</span>
            ${product.stock <= 5 && product.stock > 0 ? `<div class="stock-indicator">Only ${product.stock} left!</div>` : ''}
            ${product.stock === 0 ? `<div class="stock-indicator out-of-stock">Out of Stock</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-meta">${product.category} • ${product.weight}</div>
            <div class="product-rating">⭐ ${product.rating}</div>
            <div class="product-price">
                <span class="current-price">₹${product.price}</span>
                ${product.discount > 0 ? `<span class="original-price">₹${product.originalPrice}</span><span class="discount-badge">${product.discount}% OFF</span>` : ''}
            </div>
            ${quantity > 0 ?
            `<div class="quantity-selector">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity - 1})">−</button>
                    <span class="quantity-display">${quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity + 1})">+</button>
                </div>` :
            `<button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    🛒 ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>`
        }
        </div>
    `;

    return card;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        updateQuantity(productId, existingItem.quantity + 1);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            weight: product.weight,
            quantity: 1,
            maxStock: product.stock
        });
        showToast('Added to cart!');
    }

    saveCart();
    updateCartDisplay();
    renderProducts();
}

function updateQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (!cartItem || !product) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > product.stock) {
        showToast('Not enough stock available!');
        return;
    }

    cartItem.quantity = newQuantity;
    saveCart();
    updateCartDisplay();
    renderProducts();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    renderProducts();
    showToast('Item removed from cart');
}

function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    const cartBody = document.getElementById('cartBody');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Update badge
    if (cartCount > 0) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = 'flex';
        document.getElementById('cartItemCount').textContent = cartCount;
    } else {
        cartBadge.style.display = 'none';
    }

    // Update cart items
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h3 class="cart-empty-title">Your cart is empty</h3>
                <p class="cart-empty-text">Add some delicious items to get started!</p>
                <button class="cart-empty-btn" onclick="toggleCart()">Start Shopping</button>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartBody.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">${item.weight}</div>
                    <div class="cart-item-price">₹${item.price * item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                        <button class="cart-item-quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span class="cart-item-quantity-display">${item.quantity}</span>
                        <button class="cart-item-quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 300 ? 0 : 40;
    const discount = Math.floor(subtotal * 0.05);
    const total = subtotal + deliveryFee - discount;

    document.getElementById('cartSummary').innerHTML = `
        <div class="summary-row"><span class="summary-label">Subtotal:</span><span  class="summary-value">₹${subtotal}</span></div>
        <div class="summary-row"><span class="summary-label">Delivery Fee:</span><span class="summary-value">${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</span></div>
        <div class="summary-row"><span class="summary-label">Discount:</span><span class="summary-value">-₹${discount}</span></div>
        <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
        <div class="summary-row"><span class="summary-label summary-total">Total:</span><span class="summary-value summary-total">₹${total}</span></div>
        ${discount > 0 ? `<div class="savings-badge">You saved ₹${discount} on this order! 🎉</div>` : ''}
    `;

    document.getElementById('checkoutBtn').innerHTML = `Proceed to Checkout - ₹${total}`;
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    const isOpen = sidebar.classList.contains('open');

    if (isOpen) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileContent');

    // Get complete user data from registrations
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const fullUser = registrations.find(user => user.customerId === currentUser.customerId);

    if (fullUser) {
        const registeredDate = new Date(fullUser.registeredAt).toLocaleDateString();
        const lastLoginDate = fullUser.lastLogin ? new Date(fullUser.lastLogin).toLocaleString() : 'Never';

        content.innerHTML = `
            <div style="display: grid; gap: 16px;">
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Username (Login)</div>
                    <div style="font-size: 16px; font-weight: 600; color: var(--primary);">${fullUser.username || 'Not set'}</div>
                </div>
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Customer ID</div>
                    <div style="font-size: 16px; font-weight: 600; color: var(--text-light);">${fullUser.customerId}</div>
                </div>
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Name</div>
                    <div style="font-size: 16px; font-weight: 600;">${fullUser.name}</div>
                </div>
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Email</div>
                    <div style="font-size: 16px; font-weight: 600;">${fullUser.email}</div>
                </div>
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Contact</div>
                    <div style="font-size: 16px; font-weight: 600;">${fullUser.contact}</div>
                </div>
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Address</div>
                    <div style="font-size: 16px; font-weight: 600;">${fullUser.address}</div>
                </div>
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Registered</div>
                    <div style="font-size: 16px; font-weight: 600;">${registeredDate}</div>
                </div>
                <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 12px; color: var(--text-light);">Last Login</div>
                    <div style="font-size: 16px; font-weight: 600;">${lastLoginDate}</div>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Profile Data Not Found</div>
                <div style="color: var(--text-light);">Unable to load your profile information.</div>
            </div>
        `;
    }

    modal.classList.add('show');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('show');
}

// ============================================
// PAYMENT GATEWAY FUNCTIONS
// ============================================

// Generate unique Transaction ID
function generateTransactionId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp}${random}`;
}

// Generate unique Order ID
function generateOrderId() {
    let orderId;
    let exists = true;

    while (exists) {
        const date = new Date();
        const dateStr = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0');
        const random = Math.floor(10000 + Math.random() * 90000);
        orderId = `ORD-${dateStr}-${random}`;

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        exists = orders.some(order => order.orderId === orderId);
    }

    return orderId;
}

// Format Payment Method
function formatPaymentMethod(method) {
    const methods = {
        'upi-gpay': 'Google Pay (UPI)',
        'upi-phonepe': 'PhonePe (UPI)',
        'upi-paytm': 'Paytm (UPI)',
        'upi-custom': 'UPI',
        'card': 'Credit/Debit Card',
        'wallet-amazonpay': 'Amazon Pay',
        'wallet-mobikwik': 'Mobikwik',
        'cod': 'Cash on Delivery'
    };
    return methods[method] || method;
}

// Open Payment Modal (replaces old checkout)
function openCheckoutModal() {
    const paymentModal = document.getElementById('paymentModal');
    const summaryDiv = document.getElementById('paymentOrderSummary');

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee;

    // Update order summary
    summaryDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-weight: 600; color: #1F2937;">${cart.length} items</span>
            <span style="font-size: 24px; font-weight: 700; color: #10B981;">₹${total}</span>
        </div>
        <div style="font-size: 13px; color: #6B7280;">
            <div>Subtotal: ₹${subtotal}</div>
            <div>Delivery: ${deliveryFee === 0 ? 'FREE' : '₹' + deliveryFee}</div>
        </div>
    `;

    // Update total in button
    document.getElementById('paymentTotalAmount').textContent = `₹${total}`;

    // Show modal
    paymentModal.classList.add('show');

    // Setup card form toggle
    setTimeout(() => {
        const cardRadio = document.getElementById('card');
        if (cardRadio) {
            cardRadio.addEventListener('change', function () {
                const cardForm = document.getElementById('cardFormSection');
                if (this.checked) {
                    cardForm.style.display = 'block';
                    cardForm.innerHTML = `
                        <input type="text" placeholder="Card Number" maxlength="19" id="cardNumber" 
                               style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; margin-bottom: 12px; font-size: 14px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                            <input type="text" placeholder="MM/YY" maxlength="5" id="cardExpiry" 
                                   style="padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;">
                            <input type="text" placeholder="CVV" maxlength="3" id="cardCvv" 
                                   style="padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;">
                        </div>
                        <input type="text" placeholder="Cardholder Name" id="cardName" 
                               style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;">
                    `;
                } else {
                    cardForm.style.display = 'none';
                }
            });
        }
    }, 100);
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
}

// Handle Payment Submission
function handlePaymentSubmission() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');

    if (!selectedPayment) {
        showToast('Please select a payment method');
        return;
    }

    const paymentMethod = selectedPayment.value;
    const paymentData = { method: paymentMethod };

    // Validate custom UPI ID
    if (paymentMethod === 'upi-custom') {
        const upiId = document.getElementById('customUpiInput').value;
        if (!upiId || !/[\w.-]+@[\w.-]+/.test(upiId)) {
            showToast('Please enter a valid UPI ID');
            return;
        }
        paymentData.upiId = upiId;
    }

    // Validate card details
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber')?.value;
        const cardExpiry = document.getElementById('cardExpiry')?.value;
        const cardCvv = document.getElementById('cardCvv')?.value;
        const cardName = document.getElementById('cardName')?.value;

        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            showToast('Please fill all card details');
            return;
        }

        paymentData.cardLast4 = cardNumber.slice(-4);
    }

    // Show processing
    const btn = document.getElementById('proceedPaymentBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Processing...</span> ⏳';
    btn.disabled = true;

    // Simulate payment processing
    setTimeout(() => {
        const result = processPayment(paymentData);

        btn.innerHTML = originalText;
        btn.disabled = false;

        if (result.success) {
            closePaymentModal();
            showOrderConfirmation(result.order);
        } else {
            showToast(result.error);
        }
    }, 2000);
}

// Process Payment and Create Order
function processPayment(paymentData) {
    if (!currentUser || cart.length === 0) {
        return { success: false, error: 'Invalid session or empty cart' };
    }

    const orderId = generateOrderId();
    const transactionId = generateTransactionId();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0;
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee - discount;

    const order = {
        orderId, transactionId,
        customerId: currentUser.customerId,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerContact: currentUser.contact,
        deliveryAddress: currentUser.address,

        items: cart.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            originalPrice: item.originalPrice || item.price,
            image: item.image,
            weight: item.weight
        })),

        subtotal, discount, deliveryFee, total,

        paymentMethod: paymentData.method,
        paymentStatus: paymentData.method === 'cod' ? 'Pending' : 'Completed',
        paymentDetails: {
            method: paymentData.method,
            upiId: paymentData.upiId || null,
            cardLast4: paymentData.cardLast4 || null,
            paymentTime: new Date().toISOString()
        },

        orderStatus: 'Confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 15 * 60000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    renderProducts();

    return { success: true, order };
}

// Show Order Confirmation
function showOrderConfirmation(order) {
    const overlay = document.getElementById('orderSuccessOverlay');
    const content = overlay.querySelector('.success-content');

    content.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 80px; height: 80px; margin: 0 auto 24px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #10B981; position: relative;">
                    <span style="position: absolute; top: 20px; left: 14px; display: block; height: 5px; width: 25px; background: #10B981; transform: rotate(45deg); border-radius: 2px;"></span>
                    <span style="position: absolute; top: 12px; right: 8px; display: block; height: 5px; width: 47px; background: #10B981; transform: rotate(-45deg); border-radius: 2px;"></span>
                </div>
            </div>
            
            <h2 style="color: #10B981; font-size: 32px; margin-bottom: 8px;">Order Placed! 🎉</h2>
            <p style="color: #6B7280; margin-bottom: 32px;">Delivery in 10-15 minutes</p>
            
            <div style="background: #F9FAFB; padding: 24px; border-radius: 16px; margin-bottom: 24px; text-align: left;">
                <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
                    <div style="font-size: 12px; color: #6B7280;">Order ID</div>
                    <div style="font-size: 20px; font-weight: 700; display: flex; justify-content: space-between; align-items: center;">
                        <span>${order.orderId}</span>
                        <button onclick="copyToClipboard('${order.orderId}')" style="background: #10B981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">📋</button>
                    </div>
                </div>
                
                <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
                    <div style="font-size: 12px; color: #6B7280;">Transaction ID</div>
                    <div style="font-size: 16px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                        <span>${order.transactionId}</span>
                        <button onclick="copyToClipboard('${order.transactionId}')" style="background: #10B981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">📋</button>
                    </div>
                </div>
                
                <div style="display: grid; gap: 12px; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6B7280;">Payment:</span>
                        <span style="font-weight: 600;">${formatPaymentMethod(order.paymentMethod)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6B7280;">Total:</span>
                        <span style="font-size: 24px; font-weight: 700; color: #10B981;">₹${order.total}</span>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="showOrderHistory()" class="btn-outline" style="width: 100%;">📋 Orders</button>
                <button onclick="continueShopping()" class="checkout-btn" style="width: 100%;">🛒 Shop</button>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied!');
    });
}

// Continue Shopping
function continueShopping() {
    document.getElementById('orderSuccessOverlay').style.display = 'none';
    showHomePage();
}

function closeCheckoutModal() {
    closePaymentModal();
}

function placeOrder() {
    handlePaymentSubmission();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--success); color: white; padding: 12px 20px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; z-index: 4000; animation: slideInRight 0.3s ease; box-shadow: var(--shadow-lg);';

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function toggleUserDropdown() {
    console.log('User dropdown clicked');
}

// Logout function
function logout() {
    // Confirm logout
    const confirmLogout = confirm('Are you sure you want to logout?');

    if (confirmLogout) {
        // Clear current session
        localStorage.removeItem('currentUser');

        // Optionally clear cart (keep it for now)
        // localStorage.removeItem('cart');

        // Show logout message
        showToast('Logged out successfully', 'info');

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// ============================================
// ORDER HISTORY FUNCTIONS
// ============================================

// Show Home Page
function showHomePage() {
    document.getElementById('orderHistoryPage').style.display = 'none';
    document.querySelector('.welcome-section').style.display = 'block';
    document.querySelector('.category-section').style.display = 'block';
    document.querySelector('.products-section').style.display = 'block';

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const homeLink = document.querySelector('.nav-link[onclick*="showHomePage"]');
    if (homeLink) homeLink.classList.add('active');
}

// Show Order History
function showOrderHistory() {
    document.getElementById('orderSuccessOverlay').style.display = 'none';
    document.querySelector('.welcome-section').style.display = 'none';
    document.querySelector('.category-section').style.display = 'none';
    document.querySelector('.products-section').style.display = 'none';
    document.getElementById('orderHistoryPage').style.display = 'block';

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const ordersLink = document.querySelector('.nav-link[onclick*="showOrderHistory"]');
    if (ordersLink) ordersLink.classList.add('active');

    loadOrderHistory();
}

// Load Order History
function loadOrderHistory() {
    if (!currentUser) return;

    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = allOrders.filter(order => order.customerId === currentUser.customerId);

    displayOrders(userOrders);
}

// Display Orders
function displayOrders(orders) {
    const container = document.getElementById('ordersListContainer');
    const emptyState = document.getElementById('emptyOrdersState');

    if (orders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyState.style.display = 'none';

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-card-header">
                <div>
                    <h3>${order.orderId}</h3>
                    <span class="order-date">
                        ${new Date(order.orderDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
                    </span>
                </div>
                <div>
                    <span class="order-status status-${order.orderStatus.toLowerCase()}">
                        ${order.orderStatus}
                    </span>
                </div>
            </div>
            
            <div class="order-items-preview">
                ${order.items.slice(0, 3).map(item => `
                    <div class="order-item-preview">
                        <div class="item-image">${item.image}</div>
                        <div>
                            <span class="item-name">${item.productName}</span>
                            <span class="item-qty">Qty: ${item.quantity}</span>
                        </div>
                    </div>
                `).join('')}
                ${order.items.length > 3 ? `
                    <div style="display: flex; align-items: center; padding: 8px 12px; background: #F9FAFB; border-radius: 8px; color: #6B7280; font-size: 12px; font-weight: 600;">
                        +${order.items.length - 3} more
                    </div>
                ` : ''}
            </div>
            
            <div class="order-card-footer">
                <div>
                    <span style="font-size: 12px; color: #6B7280;">Total Amount:</span>
                    <span class="amount-value">₹${order.total}</span>
                </div>
                <div>
                    <span style="font-size: 12px; color: #6B7280;">${formatPaymentMethod(order.paymentMethod)}</span>
                    <span class="payment-status-badge ${order.paymentStatus.toLowerCase()}">
                        ${order.paymentStatus}
                    </span>
                </div>
            </div>
            
            <div class="transaction-info">
                <strong>Transaction ID:</strong> ${order.transactionId}
                <button onclick="copyToClipboard('${order.transactionId}')" class="copy-btn-small">
                    📋
                </button>
            </div>
            
            <div class="order-actions">
                <button onclick="viewOrderDetails('${order.orderId}')" class="btn-outline">
                    View Details
                </button>
                <button onclick="reorderItems('${order.orderId}')" class="btn-outline">
                    🔄 Reorder
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Orders
function filterOrders() {
    if (!currentUser) return;

    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    let userOrders = allOrders.filter(order => order.customerId === currentUser.customerId);

    // Filter by status
    const statusFilter = document.getElementById('statusFilter').value;
    if (statusFilter !== 'all') {
        userOrders = userOrders.filter(order => order.orderStatus === statusFilter);
    }

    // Sort by date
    const dateSort = document.getElementById('dateSort').value;
    userOrders.sort((a, b) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Search by Order ID
    const searchQuery = document.getElementById('orderSearch').value.toLowerCase();
    if (searchQuery) {
        userOrders = userOrders.filter(order => order.orderId.toLowerCase().includes(searchQuery));
    }

    displayOrders(userOrders);
}

// View Order Details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        showToast('Order not found');
        return;
    }

    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');

    content.innerHTML = `
        <div style="background: #F9FAFB; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                <div>
                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Order ID</div>
                    <div style="font-weight: 700; font-size: 16px;">${order.orderId}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Transaction ID</div>
                    <div style="font-weight: 600; font-size: 14px;">${order.transactionId}</div>
                </div>
                <div>
                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Order Date</div>
                    <div style="font-weight: 600; font-size: 14px;">
                        ${new Date(order.orderDate).toLocaleString('en-IN')}
                    </div>
                </div>
                <div>
                    <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Status</div>
                    <span class="order-status status-${order.orderStatus.toLowerCase()}">
                        ${order.orderStatus}
                    </span>
                </div>
            </div>
        </div>
        
        <h3 style="margin-bottom: 16px;">Items</h3>
        <div style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 24px;">
            ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #E5E7EB;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 32px;">${item.image}</div>
                        <div>
                            <div style="font-weight: 600;">${item.productName}</div>
                            <div style="font-size: 13px; color: #6B7280;">${item.weight} • Qty: ${item.quantity}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700; color: #10B981;">₹${item.price * item.quantity}</div>
                        <div style="font-size: 12px; color: #6B7280;">₹${item.price} each</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <h3 style="margin-bottom: 16px;">Payment Summary</h3>
        <div style="background: #F9FAFB; padding: 20px; border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span>Subtotal:</span>
                <span style="font-weight: 600;">₹${order.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span>Delivery Fee:</span>
                <span style="font-weight: 600;">${order.deliveryFee === 0 ? 'FREE' : '₹' + order.deliveryFee}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #E5E7EB;">
                <span style="font-weight: 700; font-size: 18px;">Total:</span>
                <span style="font-weight: 700; font-size: 18px; color: #10B981;">₹${order.total}</span>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Payment Method:</span>
                    <span style="font-weight: 600;">${formatPaymentMethod(order.paymentMethod)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                    <span>Payment Status:</span>
                    <span class="payment-status-badge ${order.paymentStatus.toLowerCase()}">
                        ${order.paymentStatus}
                    </span>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.remove('show');
}

// Reorder Items
function reorderItems(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        showToast('Order not found');
        return;
    }

    // Add all items from the order back to cart
    order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && product.stock > 0) {
            const existingItem = cart.find(cartItem => cartItem.id === product.id);
            if (existingItem) {
                const newQty = Math.min(existingItem.quantity + item.quantity, product.stock);
                existingItem.quantity = newQty;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    weight: product.weight,
                    quantity: Math.min(item.quantity, product.stock),
                    maxStock: product.stock
                });
            }
        }
    });

    saveCart();
    updateCartDisplay();
    renderProducts();
    showToast('Items added to cart!');
    showHomePage();
}
