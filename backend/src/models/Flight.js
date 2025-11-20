const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true, unique: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    price: { type: Number, required: true },
    aircraft: { type: String, default: 'A320' },
    gate: { type: String, default: 'TBD' },
    totalSeats: { type: Number, required: true, min: 1, default: 60 },
    availableSeats: { type: Number, required: true, min: 0 },
    seatMap: [
      {
        code: String,
        class: { type: String, enum: ['ECONOMY', 'BUSINESS'], default: 'ECONOMY' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', FlightSchema);

