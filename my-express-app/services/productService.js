const productRepository = require('../repositories/productRepository');

class ProductService {
  getProducts(category) {
    const products = productRepository.getAllProducts();
    if (category) {
      return products.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    return products;
  }
}

module.exports = new ProductService();
