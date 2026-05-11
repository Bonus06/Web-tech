const express = require('express');
const path = require('path');

// Import Database configuration (instantiates the connection)
require('./config/db');

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express! 🚀' });
});

// A sample API route
app.get('/api/greet/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello, ${name}! Welcome to Express.` });
});

// Serve static files from the parent directory (frontend)
app.use(express.static(path.join(__dirname, '../')));

// Register Routes
app.use('/api/products', productRoutes);
app.use('/api', authRoutes);
app.use('/api/checkout', checkoutRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
