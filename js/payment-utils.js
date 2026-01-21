// Payment Gateway Utility Functions
// This file contains all payment-related functionality

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

// Format Payment Method Name
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

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Process Payment and Create Order
function processPayment(paymentData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (!currentUser || cart.length === 0) {
        return { success: false, error: 'Invalid session or empty cart' };
    }

    // Generate IDs
    const orderId = generateOrderId();
    const transactionId = generateTransactionId();

    // Calculate amounts
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0;
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee - discount;

    // Create order object
    const order = {
        orderId: orderId,
        transactionId: transactionId,
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

        subtotal: subtotal,
        discount: discount,
        deliveryFee: deliveryFee,
        total: total,

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

    // Save order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    return {
        success: true,
        order: order
    };
}
