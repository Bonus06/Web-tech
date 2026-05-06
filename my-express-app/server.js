const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'super-secret-key';

// Middleware to parse JSON
app.use(express.json());

// Sample product data
const products = [
  { id: 1, name: 'Nordic Chair', category: 'chair', price: 50 },
  { id: 2, name: 'Kruzo Aero Chair', category: 'chair', price: 78 },
  { id: 3, name: 'Ergonomic Chair', category: 'chair', price: 43 },
  { id: 4, name: 'Modern Table', category: 'table', price: 150 }
];

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express! 🚀' });
});

// A sample API route
app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello, ${name}! Welcome to Express.` });
});

// RESTful route to get products (with optional category filter)
app.get('/api/products', (req, res) => {
  // 1. Extract the 'category' from the query parameters (e.g. /api/products?category=chair)
  const category = req.query.category;
  
  // 2. Check if the 'category' query parameter was provided
  if (category) {
    // 3. If provided, filter the products array where the category matches (case-insensitive)
    const filteredProducts = products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
    // 4. Return the filtered list
    return res.json(filteredProducts);
  }
  
  // 5. If no category was provided, return the entire list of products
  res.json(products);
});

// Serve static files from the parent directory (frontend)
const path = require('path');
app.use(express.static(path.join(__dirname, '../')));

// Load users from auth_user.json
let users = [];
try {
  const usersData = fs.readFileSync(path.join(__dirname, 'auth_user.json'), 'utf-8');
  users = JSON.parse(usersData);
} catch (err) {
  console.log('Could not load auth_user.json, using empty users array');
}

// Mock login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = users.find(u => u.username === email || u.email === email);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ success: true, message: 'Login successful', token });
});

// Mock signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const existingUser = users.find(u => u.username === email || u.email === email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { 
    id: users.length + 1,
    firstName: name,
    username: email, 
    email: email,
    password: hashedPassword,
    registeredAt: new Date().toISOString()
  };
  
  users.push(newUser);
  fs.writeFileSync(path.join(__dirname, 'auth_user.json'), JSON.stringify(users, null, 2));

  res.status(201).json({ success: true, message: 'Signup successful' });
});

// Checkout endpoint
app.post('/api/checkout', async (req, res) => {
  const { cartItems, email, cardNumber } = req.body;
  const errors = {};

  try {
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

    // If validation fails, throw custom error to be caught in the catch block
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

    // Save Order Step (Mocked)
    // e.g. const order = await db.saveOrder({ cartItems, email, total })
    
    // Send success response (frontend should clear cart on success)
    res.status(200).json({
      success: true,
      message: 'Order processed successfully.',
      total: total
    });
  } catch (error) {
    // Send 400 status with specific error messages for each failed field
    // Frontend will NOT clear the user's cart on receiving 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Checkout failed. Please check the fields.',
        errors: error.fieldErrors
      });
    }

    // Catch-all for any other unexpected errors during Save Order
    res.status(400).json({
      success: false,
      message: 'An error occurred while saving the order.',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
