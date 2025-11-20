const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch users', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Validate role
    if (role && !['admin', 'traveler'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "admin" or "traveler"' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role || 'traveler',
    });

    // Return user without password hash
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({ 
      message: 'User created successfully',
      user: userResponse 
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create user', error: error.message });
  }
};

