const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'finesseDev2024!';
  if (username === validUser && password === validPass) {
    const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET || 'finesse_secret', { expiresIn: '7d' });
    return res.json({ token, username, role: 'admin' });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ valid: true, user: req.user });
});
module.exports = router;
