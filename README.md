# 🛒 FreshCart - Grocery Delivery Application

A modern, responsive grocery delivery web application built with HTML, CSS, and JavaScript. FreshCart provides a seamless user experience for browsing products, managing carts, and placing orders.

![FreshCart Banner](https://img.shields.io/badge/Status-Active-success) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🔐 User Authentication
- **Registration**: New user sign-up with comprehensive form validation
- **Login**: Secure customer authentication with Customer ID and password
- **Session Management**: Persistent user sessions using localStorage

### 🏠 Home Dashboard
- **Personalized Welcome**: Greeting message with user's name
- **Product Categories**: Quick filters for Fruits, Vegetables, Dairy, Snacks, Beverages, and Bakery
- **Product Search**: Real-time search functionality
- **Service Highlights**: 500+ Products, 10-minute delivery, best prices guarantee

### 🎨 Premium UI/UX
- Modern glassmorphism design
- Smooth animations and transitions
- Gradient backgrounds and vibrant color palette
- Fully responsive layout
- Interactive hover effects and micro-animations

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/freshcart.git
   cd freshcart
   ```

2. **Open in browser**
   ```bash
   # Simply open the registration page in your browser
   open registration.html
   # Or double-click the registration.html file
   ```

## 📁 Project Structure

```
FreshCart/
├── registration.html      # User registration page
├── login.html            # User login page
├── home.html             # Main dashboard/home page
├── css/
│   └── styles.css        # Shared styles for all pages
├── js/
│   ├── registration.js   # Registration page logic
│   ├── login.js          # Login page logic
│   └── home.js           # Home page logic
└── README.md             # Project documentation
```

## 🔑 Test Credentials

### ⭐ Universal Demo Account (Works on ANY system!)

For **instant testing without registration**, use these hardcoded credentials:

> **Customer ID**: `demo`  
> **Password**: `Demo@123`

✅ **No registration needed** - Works immediately after cloning  
✅ **No localStorage dependency** - Works on any new PC/system  
✅ **Perfect for demos** - Share with anyone to test the app

---

### Alternative: Create Your Own Account

You can also register a new account through `registration.html` which will:
1. Generate a unique Customer ID (e.g., `CUS-691828`)
2. Store credentials in your browser's localStorage
3. Work only on that specific browser/device


## 📖 Usage Guide

### Registration Flow
1. Open `registration.html`
2. Fill in all required fields:
   - Full Name
   - Email Address
   - Password (with confirmation)
   - Phone Number
   - Delivery Address
3. Accept Terms & Conditions
4. Click "Create Account"
5. Success overlay will appear and redirect to login

### Login Flow
1. Open `login.html`
2. Enter Customer ID: `demo`
3. Enter Password: `Demo@123`
4. Click "Login to Account"
5. Redirected to personalized home page

### Home Page Features
- **Search**: Use the search bar to find products
- **Categories**: Click category buttons to filter products
- **Navigation**: Access My Profile, Cart, and Logout from the top navigation
- **Product Carousel**: Browse featured products with "Add to Cart" functionality

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: localStorage for user data and sessions
- **Styling**: Custom CSS with modern design patterns (gradients, glassmorphism, animations)
- **Fonts**: Google Fonts (Inter, Outfit)
- **Icons**: Lucide Icons

## 🎯 Key Features Implementation

### Form Validation
- Real-time validation on all input fields
- Password strength requirements
- Email format verification
- Phone number validation
- Required field checks

### Security Features
- Password hashing (basic implementation)
- Session management
- Protected routes (redirects to login if not authenticated)
- Input sanitization

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interactive elements

## 🔄 Navigation Flow

```
registration.html → login.html → home.html
                       ↓
                  (If already registered)
```

## 📝 Development Notes

### localStorage Schema

**Users Data:**
```javascript
{
  "users": [
    {
      "customerId": "CUS-XXXXXX",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "hashedPassword",
      "phone": "1234567890"
    }
  ]
}
```

**Current User Session:**
```javascript
{
  "currentUser": {
    "customerId": "CUS-691828",
    "name": "John"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Inspiration from modern e-commerce platforms

## 📧 Contact

For questions or suggestions, please open an issue or contact at: your.email@example.com

---

**Note**: This is a frontend-only demonstration application. For production use, implement proper backend authentication, database storage, and security measures.
