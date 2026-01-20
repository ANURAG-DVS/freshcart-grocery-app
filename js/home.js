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
        if (currentUser) {
            document.getElementById('userName').textContent = currentUser.name.split(' ')[0];
            document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
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

    content.innerHTML = `
        <div style="display: grid; gap: 16px;">
            <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div style="font-size: 12px; color: var(--text-light);">Customer ID</div>
                <div style="font-size: 16px; font-weight: 600;">${currentUser.customerId}</div>
            </div>
            <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div style="font-size: 12px; color: var(--text-light);">Name</div>
                <div style="font-size: 16px; font-weight: 600;">${currentUser.name}</div>
            </div>
            <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div style="font-size: 12px; color: var(--text-light);">Email</div>
                <div style="font-size: 16px; font-weight: 600;">${currentUser.email}</div>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('show');
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutContent');
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 300 ? 0 : 40;
    const discount = Math.floor(subtotal * 0.05);
    const total = subtotal + deliveryFee - discount;

    content.innerHTML = `
        <h3>Order Summary</h3>
        <div style="margin: 24px 0;">
            ${cart.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                    <div><span style="font-size: 24px;">${item.image}</span> ${item.name} x${item.quantity}</div>
                    <div style="font-weight: 600;">₹${item.price * item.quantity}</div>
                </div>
            `).join('')}
        </div>
        <div style="background: var(--bg-secondary); padding: 20px; border-radius: var(--radius-lg); margin: 24px 0;">
            <div style="display: flex; justify-content: space-between;"><span>Total:</span><span style="font-size: 18px; font-weight: 700; color: var(--primary);">₹${total}</span></div>
        </div>
        <button style="width: 100%; padding: 16px; background: var(--primary); color: white; border: none; border-radius: var(--radius-md); font-size: 16px; font-weight: 700; cursor: pointer;" onclick="placeOrder()">Place Order - ₹${total}</button>
    `;

    modal.classList.add('show');
    toggleCart();
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('show');
}

function placeOrder() {
    cart = [];
    saveCart();
    closeCheckoutModal();
    showToast('Order placed successfully! 🎉');
    updateCartDisplay();
    renderProducts();
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
