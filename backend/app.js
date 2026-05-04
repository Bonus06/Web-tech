const express = require('express');
const app = express();

const productRoutes = require('./routes/products');

// middleware
app.use(express.json());

// routes
app.use('/api/products', productRoutes);

// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});