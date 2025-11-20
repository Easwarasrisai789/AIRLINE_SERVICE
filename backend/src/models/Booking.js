const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    passengerName: { type: String, required: true },
    passengerEmail: { type: String, required: true },
    seats: { type: Number, required: true, min: 1 },
    seatNumbers: [{ type: String }],
    contactNumber: { type: String },
    paymentReference: { type: String },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PAID',
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);

