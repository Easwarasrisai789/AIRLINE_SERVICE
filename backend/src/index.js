const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Manual CORS middleware as fallback
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Configure CORS - Allow all origins for now to fix deployment issues
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MERN Airline Reservation API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check for monitoring
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/manual', require('./routes/manualRoutes'));

const start = async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();

