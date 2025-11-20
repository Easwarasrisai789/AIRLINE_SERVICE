const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'MERN Airline Reservation API' });
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

