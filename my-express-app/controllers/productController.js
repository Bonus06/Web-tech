const productService = require('../services/productService');

class ProductController {
  getProducts(req, res) {
    const category = req.query.category;
    try {
      const products = productService.getProducts(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = new ProductController();
