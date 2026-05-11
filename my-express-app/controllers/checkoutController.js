const checkoutService = require('../services/checkoutService');

class CheckoutController {
  async checkout(req, res) {
    try {
      const { cartItems, email, cardNumber } = req.body;
      const result = await checkoutService.processCheckout(cartItems, email, cardNumber);
      
      res.status(200).json({
        success: true,
        message: 'Order processed successfully.',
        total: result.total
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Checkout failed. Please check the fields.',
          errors: error.fieldErrors
        });
      }

      res.status(400).json({
        success: false,
        message: 'An error occurred while saving the order.',
        error: error.message
      });
    }
  }
}

module.exports = new CheckoutController();
