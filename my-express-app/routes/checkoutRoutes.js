const express = require('express');
const rateLimit = require('express-rate-limit');
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Define a rate limiter for the checkout route
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many checkout requests from this IP, please try again after 15 minutes.'
  }
});

router.post('/', checkoutLimiter, authMiddleware, (req, res) => checkoutController.checkout(req, res));

module.exports = router;
