const express = require('express');
const app = express();
const PORT = 3000;

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

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
