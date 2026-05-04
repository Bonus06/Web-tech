const productService = require('../services/productService');

exports.getProducts = (req, res) => {
  try {
    const { category } = req.query;

    const products = productService.getAllProducts(category);

    if (products.length === 0) {
      return res.status(404).json({
        message: 'No products found'
      });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};