const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
      if (error.message.includes('Invalid')) {
        return res.status(401).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      await authService.signup(name, email, password);
      res.status(201).json({ success: true, message: 'Signup successful' });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
