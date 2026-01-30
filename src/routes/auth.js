const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// Bootstrap: create default admin if none exists
router.post('/bootstrap', async (req, res) => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  let admin = await Admin.findOne({ username: ADMIN_USERNAME });
  if (!admin) {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ username: ADMIN_USERNAME, password: hashed });
    return res.json({ message: 'Default admin created.' });
  }
  res.json({ message: 'Admin already exists.' });
});

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: 'User not found' });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ admin: { id: admin._id, username: admin.username } }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// (Optional) Logout (handled client-side by deleting token)

module.exports = router;
