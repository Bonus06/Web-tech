const db = require('../config/db');

class OrderRepository {
  saveOrder(userId, productId, quantity, totalPrice) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO orders (user_id, product_id, quantity, total_price)
        VALUES (?, ?, ?, ?)
      `;
      db.run(sql, [userId, productId, quantity, totalPrice], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
}

module.exports = new OrderRepository();
