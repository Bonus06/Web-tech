const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = 'super-secret-key';

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    const user = userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  async signup(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('Please provide all required fields');
    }

    const existingUser = userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
      firstName: name,
      username: email, 
      email: email,
      password: hashedPassword,
      registeredAt: new Date().toISOString()
    };

    return userRepository.addUser(newUser);
  }
}

module.exports = new AuthService();
