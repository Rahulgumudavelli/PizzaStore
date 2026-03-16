const { registerUser, loginUser } = require('../services/authService');

// REGISTER
const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      ...result
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };