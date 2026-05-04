const fs = require('fs');
const path = require('path');

const getAllProducts = (category) => {
  const filePath = path.join(__dirname, '../data/products.json');

  const rawData = fs.readFileSync(filePath, 'utf-8');
  let products = JSON.parse(rawData);

  // filter ตาม category
  if (category) {
    products = products.filter(
      (item) =>
        item.category.toLowerCase() === category.toLowerCase()
    );
  }

  return products;
};

module.exports = {
  getAllProducts
};