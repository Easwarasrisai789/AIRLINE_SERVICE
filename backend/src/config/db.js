const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  try {
    const uri = mongoUri || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Missing MongoDB connection string');
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Mongo connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

