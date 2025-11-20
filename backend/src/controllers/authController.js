const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const buildToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = buildToken(user);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('Login attempt - User not found:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log('Login attempt - Invalid password for:', normalizedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = buildToken(user);
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user.id } });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const updateData = { name, email: normalizedEmail };
    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber.trim();
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    res.json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phoneNumber: user.phoneNumber || '',
        role: user.role 
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

