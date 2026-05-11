const orderRepository = require('../repositories/orderRepository');
const userRepository = require('../repositories/userRepository');

class CheckoutService {
  async processCheckout(cartItems, email, cardNumber) {
    const errors = {};

    // 1. Check incoming cart items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      errors.cartItems = 'Cart is empty or invalid.';
    }

    // 2. Check email using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Invalid email address format.';
    }

    // 3. Check 16-digit credit card number using regex
    const cardRegex = /^\d{16}$/;
    if (!cardNumber || !cardRegex.test(cardNumber.replace(/\s+/g, ''))) {
      errors.cardNumber = 'Credit card must be exactly 16 digits.';
    }

    // If validation fails, throw custom error
    if (Object.keys(errors).length > 0) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.fieldErrors = errors;
      throw error;
    }

    // 4. Calculate the total
    let total = 0;
    for (const item of cartItems) {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      total += price * quantity;
    }

    // Save Order Step (Simulated Microservice Communication)
    // We are replacing the direct repository call with a network call (fetch).
    let userId = null;
    try {
      const response = await fetch(`http://user-service/api/verify?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const userData = await response.json();
        userId = userData.id;
      } else {
        console.warn('User service responded with an error status');
      }
    } catch (error) {
      console.error('Simulated microservice fetch failed:', error.message);
      // In a real scenario, you'd handle this failure (e.g., throw error, circuit breaker, etc.)
    }

    const savedOrders = [];
    for (const item of cartItems) {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      const itemTotal = price * quantity;
      
      try {
        const orderId = await orderRepository.saveOrder(userId, item.id, quantity, itemTotal);
        savedOrders.push(orderId);
      } catch (err) {
        console.error('Error inserting order:', err.message);
        throw new Error('Error saving order details');
      }
    }

    return { total, savedOrders };
  }
}

module.exports = new CheckoutService();
