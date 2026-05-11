const products = [
  { id: 1, name: 'Nordic Chair', category: 'chair', price: 50 },
  { id: 2, name: 'Kruzo Aero Chair', category: 'chair', price: 78 },
  { id: 3, name: 'Ergonomic Chair', category: 'chair', price: 43 },
  { id: 4, name: 'Modern Table', category: 'table', price: 150 }
];

class ProductRepository {
  getAllProducts() {
    return products;
  }
}

module.exports = new ProductRepository();
