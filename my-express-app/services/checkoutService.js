const orderRepository = require('../repositories/orderRepository');
const userRepository = require('../repositories/userRepository');
const productRepository = require('../repositories/productRepository');

class CheckoutService {
  async processCheckout(userId, cartItems, email, cardNumber) {
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

    // 4. Calculate the total securely and validate items
    let total = 0;
    const validatedItems = [];
    
    if (!errors.cartItems) {
      const products = productRepository.getAllProducts();
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const quantity = parseInt(item.quantity);
        
        if (isNaN(quantity) || quantity <= 0) {
          errors[`cartItems[${i}].quantity`] = 'Quantity must be a positive integer.';
          continue;
        }

        const product = products.find(p => p.id === parseInt(item.id));
        if (!product) {
          errors[`cartItems[${i}].id`] = 'Product not found.';
          continue;
        }

        const itemTotal = product.price * quantity;
        total += itemTotal;
        validatedItems.push({ id: product.id, quantity, itemTotal });
      }
    }

    // If validation fails, throw custom error
    if (Object.keys(errors).length > 0) {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.fieldErrors = errors;
      throw error;
    }

    // Save Order Step
    const savedOrders = [];
    for (const item of validatedItems) {
      try {
        const orderId = await orderRepository.saveOrder(userId, item.id, item.quantity, item.itemTotal);
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
