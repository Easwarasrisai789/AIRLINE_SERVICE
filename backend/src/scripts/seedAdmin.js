/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const ADMIN_EMAIL = '2200032881cseh@gmail.com'.toLowerCase();
const ADMIN_PASSWORD = 'V@nky2003';

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        name: 'Airline Admin',
        email: ADMIN_EMAIL,
        passwordHash,
        role: 'admin',
      },
      { upsert: true, new: true }
    );

    console.log('Admin ready:', admin.email);
  } catch (error) {
    console.error('Seeding admin failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();

