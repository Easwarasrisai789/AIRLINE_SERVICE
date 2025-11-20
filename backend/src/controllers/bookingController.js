const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { sendBookingReceipt } = require('../utils/email');

const buildPaymentReference = () =>
  `PAY-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

exports.createBooking = async (req, res) => {
  try {
    const {
      flightId,
      passengerName,
      passengerEmail,
      seats,
      seatNumbers = [],
      contactNumber,
      paymentMethod,
      cardLast4,
    } = req.body;

    if (!flightId || !passengerName || !passengerEmail || !seats) {
      return res.status(400).json({ message: 'Missing booking information' });
    }

    // Check if user has phone number in profile
    const user = await require('../models/User').findById(req.user.id);
    if (!user.phoneNumber || user.phoneNumber.trim() === '') {
      return res.status(400).json({ 
        message: 'Phone number is required. Please update your profile with a phone number before booking.' 
      });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough seats left' });
    }

    const activeBookings = await Booking.find({ flight: flightId, status: 'CONFIRMED' });
    const reservedSeatSet = new Set(activeBookings.flatMap((b) => b.seatNumbers));

    let chosenSeats = seatNumbers.filter(Boolean);
    if (chosenSeats.length && chosenSeats.length !== seats) {
      return res
        .status(400)
        .json({ message: 'Seat numbers count must match seats requested' });
    }

    if (!chosenSeats.length) {
      const seatMap = flight.seatMap || [];
      chosenSeats = seatMap
        .filter((seat) => !reservedSeatSet.has(seat.code))
        .slice(0, seats)
        .map((seat) => seat.code);
    }

    for (const seat of chosenSeats) {
      if (reservedSeatSet.has(seat)) {
        return res.status(400).json({ message: `Seat ${seat} already reserved` });
      }
    }

    // Decrement available seats
    flight.availableSeats -= seats;
    await flight.save();

    const paymentReference = buildPaymentReference();
    const paymentStatus = paymentMethod ? 'PAID' : 'PENDING';

    // Use phone number from user profile if contactNumber not provided
    const finalContactNumber = contactNumber || user.phoneNumber;

    const booking = await Booking.create({
      user: req.user.id,
      flight: flightId,
      passengerName,
      passengerEmail,
      seats,
      seatNumbers: chosenSeats,
      contactNumber: finalContactNumber,
      paymentReference,
      paymentStatus,
    });

    // Recalculate to ensure accuracy (double-check)
    // Import function directly to avoid circular dependency
    const { recalculateAvailableSeats } = require('./flightController');
    await recalculateAvailableSeats(flightId);

    await booking.populate('flight');
    sendBookingReceipt(booking).catch((err) =>
      console.warn('Email send failed:', err.message)
    );

    // Fetch updated flight with correct seat count
    const updatedFlight = await Flight.findById(flightId);
    booking.flight = updatedFlight;

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

exports.listMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('flight')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch bookings', error: error.message });
  }
};

exports.listAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('flight')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch all bookings', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('flight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Cannot cancel this booking' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    const flight = await Flight.findById(booking.flight._id);
    if (flight) {
      // Increment available seats
      flight.availableSeats += booking.seats;
      await flight.save();
      
      // Recalculate to ensure accuracy
      const { recalculateAvailableSeats } = require('./flightController');
      await recalculateAvailableSeats(flight._id);
    }

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Unable to cancel booking', error: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('flight').populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to view this booking' });
    }
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch booking', error: error.message });
  }
};

