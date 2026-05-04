const express = require('express');
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

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
