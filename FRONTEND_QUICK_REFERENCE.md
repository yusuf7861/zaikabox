# ZaikaBox API - Quick Reference Guide for Frontend Developers

**Version:** 1.0  
**Last Updated:** January 28, 2026

---

## 🚀 Quick Start

### 1. Authentication Flow
```
1. Register: POST /auth/register → Get userId
2. Login: POST /auth/login → Get JWT token
3. Store JWT in localStorage or cookies
4. Use JWT in Authorization header for all authenticated requests
```

### 2. Shopping Flow
```
1. Add items to cart: POST /api/v1/carts/items/{foodId}
2. View cart: GET /api/v1/carts
3. Update cart: PUT /api/v1/carts
4. Proceed to checkout
```

### 3. Payment Flow
```
1. Initiate payment: POST /api/v1/payment/initiate
2. Open Razorpay checkout with orderId and keyId
3. User completes payment in Razorpay modal
4. Verify payment: POST /api/v1/payment/verify
5. Order automatically created, cart cleared
```

### 4. Order Management
```
1. View all orders: GET /api/v1/orders
2. View order details: GET /api/v1/orders/{orderId}
3. Track order: GET /api/v1/orders/{orderId}/track
4. Cancel order: DELETE /api/v1/orders/{orderId}
```

---

## 📱 Sample Code Snippets

### JavaScript/React - Register User
```javascript
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:8080/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password // Min 8, max 16 chars, must include uppercase, lowercase, digit, special char
    })
  });
  
  if (response.ok) {
    const user = await response.json();
    console.log('User registered:', user);
    return user;
  } else {
    const error = await response.json();
    console.error('Registration failed:', error.message);
  }
};
```

### JavaScript/React - Login
```javascript
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include' // Important: to send/receive cookies
  });
  
  if (response.ok) {
    const auth = await response.json();
    localStorage.setItem('jwt_token', auth.token);
    return auth;
  } else {
    const error = await response.json();
    console.error('Login failed:', error.message);
  }
};
```

### JavaScript/React - Add to Cart
```javascript
const addToCart = async (foodId) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch(
    `http://localhost:8080/api/v1/carts/items/${foodId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (response.ok) {
    const cart = await response.json();
    console.log('Added to cart:', cart);
    return cart;
  } else {
    const error = await response.json();
    console.error('Failed to add to cart:', error.message);
  }
};
```

### JavaScript/React - Get Cart
```javascript
const getCart = async () => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('http://localhost:8080/api/v1/carts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    const cart = await response.json();
    console.log('Cart items:', cart.items); // Map of foodId: quantity
    return cart;
  } else {
    const error = await response.json();
    console.error('Failed to fetch cart:', error.message);
  }
};
```

### JavaScript/React - Initiate Payment
```javascript
const initiatePayment = async (amount) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('http://localhost:8080/api/v1/payment/initiate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt-${Date.now()}`,
      notes: {
        cartId: 'your-cart-id',
        userId: 'your-user-id'
      }
    })
  });
  
  if (response.ok) {
    const payment = await response.json();
    console.log('Payment order created:', payment.orderId);
    return payment;
  } else {
    const error = await response.json();
    console.error('Payment initiation failed:', error.message);
  }
};
```

### JavaScript/React - Open Razorpay Checkout
```javascript
const openRazorpayCheckout = (paymentData) => {
  const options = {
    key: paymentData.keyId, // From payment initiation response
    amount: paymentData.amount, // in paise
    currency: paymentData.currency,
    order_id: paymentData.orderId, // From payment initiation response
    handler: async (response) => {
      // Payment successful, now verify on backend
      await verifyPayment(response);
    },
    prefill: {
      email: 'user@example.com',
      contact: '9999999999'
    },
    theme: {
      color: '#3399cc'
    }
  };
  
  const razorpay = new Razorpay(options);
  razorpay.open();
};
```

### JavaScript/React - Verify Payment
```javascript
const verifyPayment = async (razorpayResponse) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('http://localhost:8080/api/v1/payment/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      razorpayOrderId: razorpayResponse.order_id,
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpaySignature: razorpayResponse.razorpay_signature,
      orderId: 'custom-order-id-if-any'
    })
  });
  
  if (response.ok) {
    const orderData = await response.json();
    console.log('Payment verified, order created:', orderData.orderId);
    // Redirect to order confirmation page
    return orderData;
  } else {
    const error = await response.json();
    console.error('Payment verification failed:', error.message);
  }
};
```

### JavaScript/React - Get Orders
```javascript
const getUserOrders = async (page = 0, size = 10) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch(
    `http://localhost:8080/api/v1/orders?page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (response.ok) {
    const ordersData = await response.json();
    console.log('User orders:', ordersData.content);
    return ordersData;
  } else {
    const error = await response.json();
    console.error('Failed to fetch orders:', error.message);
  }
};
```

### JavaScript/React - Get Order Details
```javascript
const getOrderDetails = async (orderId) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch(
    `http://localhost:8080/api/v1/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (response.ok) {
    const order = await response.json();
    console.log('Order details:', order);
    // order.orderId, order.customerId, order.items[], order.totalAmountWithGST, etc.
    return order;
  } else {
    const error = await response.json();
    console.error('Failed to fetch order:', error.message);
  }
};
```

### JavaScript/React - Track Order
```javascript
const trackOrder = async (orderId) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch(
    `http://localhost:8080/api/v1/orders/${orderId}/track`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (response.ok) {
    const trackingData = await response.json();
    console.log('Order status:', trackingData.orderStatus);
    console.log('Estimated delivery:', trackingData.estimatedDelivery);
    console.log('Timeline:', trackingData.timeline);
    return trackingData;
  } else {
    const error = await response.json();
    console.error('Failed to track order:', error.message);
  }
};
```

### JavaScript/React - Cancel Order
```javascript
const cancelOrder = async (orderId, reason) => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch(
    `http://localhost:8080/api/v1/orders/${orderId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    }
  );
  
  if (response.ok) {
    const result = await response.json();
    console.log('Order cancelled, refund initiated:', result.refundAmount);
    return result;
  } else {
    const error = await response.json();
    console.error('Failed to cancel order:', error.message);
  }
};
```

---

## 🔐 Authentication Header Helper

```javascript
// Function to get authenticated request headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Or as a function that wraps fetch
const authenticatedFetch = (url, options = {}) => {
  const token = localStorage.getItem('jwt_token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Usage:
const cart = await authenticatedFetch('http://localhost:8080/api/v1/carts');
const cartData = await cart.json();
```

---

## 🛠️ Error Handling Best Practices

```javascript
const handleApiError = (error) => {
  if (error.status === 401) {
    // Unauthorized - redirect to login
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  } else if (error.status === 400) {
    // Bad request - validation error
    console.error('Validation error:', error.message);
  } else if (error.status === 404) {
    // Not found
    console.error('Resource not found:', error.message);
  } else if (error.status === 500) {
    // Server error
    console.error('Server error:', error.message);
  }
};

// Usage:
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    handleApiError(error);
  }
} catch (err) {
  console.error('Network error:', err);
}
```

---

## 📊 Response Structure Examples

### Order Response Example
```json
{
  "orderId": "FD12345",
  "customerId": "user-uuid-123",
  "items": [
    {
      "name": "Biryani",
      "quantity": 2,
      "unitPrice": 250.00,
      "total": 500.00
    }
  ],
  "subTotal": 5000.00,
  "gstRate": 18.0,
  "gstAmount": 900.00,
  "totalAmountWithGST": 5900.00,
  "paymentMode": "RAZORPAY",
  "orderDate": "2026-01-28T10:50:00Z",
  "status": "PENDING",
  "paymentStatus": "COMPLETED",
  "paymentDate": "2026-01-28T10:50:00Z",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "address": "123 Main Street",
  "zip": "12345",
  "locality": "City",
  "landmark": "Near Park",
  "country": "India",
  "state": "State"
}
```

### Cart Response Example
```json
{
  "id": "cart-mongodb-id",
  "userId": "user-uuid-123",
  "items": {
    "food-id-1": 2,
    "food-id-2": 1,
    "food-id-3": 5
  }
}
```

### Error Response Example
```json
{
  "message": "Email already exists",
  "status": "BAD_REQUEST",
  "timestamp": "2026-01-28T10:50:00Z",
  "errorCode": "EMAIL_ALREADY_EXISTS"
}
```

---

## ✅ Form Validation Rules

### Registration Form
```javascript
const validateRegistration = (data) => {
  const errors = {};
  
  // Name validation
  if (!data.name || data.name.length < 3 || data.name.length > 20) {
    errors.name = 'Name must be 3-20 characters';
  }
  
  // Email validation
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  if (!data.password || !passwordRegex.test(data.password)) {
    errors.password = 'Password must be 8-16 chars with uppercase, lowercase, digit, special char';
  }
  
  return errors;
};
```

### Cart Item Validation
```javascript
const validateCartItem = (quantity) => {
  if (typeof quantity !== 'number' || quantity < 1 || quantity > 100) {
    return 'Quantity must be between 1 and 100';
  }
  return null;
};
```

### Billing Details Validation
```javascript
const validateBillingDetails = (details) => {
  const errors = {};
  
  if (!details.firstName) errors.firstName = 'First name required';
  if (!details.lastName) errors.lastName = 'Last name required';
  if (!details.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
    errors.email = 'Valid email required';
  }
  if (!details.phoneNumber) errors.phoneNumber = 'Phone number required';
  if (!details.address) errors.address = 'Address required';
  if (!details.zip) errors.zip = 'ZIP code required';
  if (!details.locality) errors.locality = 'City/Locality required';
  if (!details.country) errors.country = 'Country required';
  if (!details.state) errors.state = 'State required';
  
  return errors;
};
```

---

## 📋 State Management Tips

### Using React Context for Cart
```javascript
const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchCart = async () => {
    setLoading(true);
    const cartData = await getCart();
    setCart(cartData);
    setLoading(false);
  };
  
  const addItem = async (foodId) => {
    const updatedCart = await addToCart(foodId);
    setCart(updatedCart);
  };
  
  return (
    <CartContext.Provider value={{ cart, addItem, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
```

---

## 🔗 Environment Configuration

```javascript
// config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  
  // Cart
  CART: `${API_BASE_URL}/api/v1/carts`,
  CART_ADD: (foodId) => `${API_BASE_URL}/api/v1/carts/items/${foodId}`,
  CART_REMOVE: (foodId) => `${API_BASE_URL}/api/v1/carts/items/${foodId}`,
  CART_COUNT: `${API_BASE_URL}/api/v1/carts/count`,
  
  // Payment
  PAYMENT_INITIATE: `${API_BASE_URL}/api/v1/payment/initiate`,
  PAYMENT_VERIFY: `${API_BASE_URL}/api/v1/payment/verify`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/v1/orders`,
  ORDER_DETAIL: (orderId) => `${API_BASE_URL}/api/v1/orders/${orderId}`,
  ORDER_TRACK: (orderId) => `${API_BASE_URL}/api/v1/orders/${orderId}/track`
};
```

---

## 📞 Support

For API questions or issues:
- Review API_DOCUMENTATION.md for detailed specifications
- Check API_FIELDS_CHECKLIST.md for field references
- Contact backend team at api-support@zaikabox.com

---

**Last Updated:** January 28, 2026  
**Version:** 1.0  
**Status:** Ready for Frontend Implementation
