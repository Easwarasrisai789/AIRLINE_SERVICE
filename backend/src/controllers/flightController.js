const Flight = require('../models/Flight');
const Booking = require('../models/Booking');

// Recalculate available seats based on actual confirmed bookings
// Export this function so it can be used by other controllers
const recalculateAvailableSeats = async (flightId) => {
  const flight = await Flight.findById(flightId);
  if (!flight) {
    return null;
  }

  // Count total seats booked in confirmed bookings
  const confirmedBookings = await Booking.find({
    flight: flightId,
    status: 'CONFIRMED',
  });

  const totalBookedSeats = confirmedBookings.reduce((sum, booking) => sum + booking.seats, 0);
  
  // Calculate available seats: totalSeats - bookedSeats
  const calculatedAvailableSeats = Math.max(0, flight.totalSeats - totalBookedSeats);
  
  // Update if different
  if (flight.availableSeats !== calculatedAvailableSeats) {
    flight.availableSeats = calculatedAvailableSeats;
    await flight.save();
  }

  return calculatedAvailableSeats;
};

// Export for use in other controllers
exports.recalculateAvailableSeats = recalculateAvailableSeats;

const buildSeatMap = (totalSeats = 60) => {
  const seatMap = [];
  const seatsPerRow = 6;
  const businessRows = 2;
  let seatCount = 0;

  for (let row = 1; seatCount < totalSeats; row += 1) {
    const seatClass = row <= businessRows ? 'BUSINESS' : 'ECONOMY';
    for (const seatLetter of ['A', 'B', 'C', 'D', 'E', 'F']) {
      const code = `${row}${seatLetter}`;
      seatMap.push({ code, class: seatClass });
      seatCount += 1;
      if (seatCount >= totalSeats) break;
    }
  }
  return seatMap;
};

exports.listFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departureTime: 1 });
    res.json({ flights });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch flights', error: error.message });
  }
};

exports.seedFlights = async (req, res) => {
  try {
    await Flight.deleteMany({});

    const now = new Date();
    const flights = await Flight.insertMany([
      {
        flightNumber: 'AI101',
        origin: 'New York (JFK)',
        destination: 'Los Angeles (LAX)',
        departureTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        arrivalTime: new Date(now.getTime() + 27 * 60 * 60 * 1000),
        price: 420,
        aircraft: 'Boeing 777',
        gate: 'A3',
        totalSeats: 60,
        availableSeats: 42,
        seatMap: buildSeatMap(60),
      },
      {
        flightNumber: 'AI205',
        origin: 'Chicago (ORD)',
        destination: 'Miami (MIA)',
        departureTime: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        arrivalTime: new Date(now.getTime() + 52 * 60 * 60 * 1000),
        price: 320,
        aircraft: 'Airbus A320',
        gate: 'B12',
        totalSeats: 48,
        availableSeats: 36,
        seatMap: buildSeatMap(48),
      },
      {
        flightNumber: 'AI509',
        origin: 'San Francisco (SFO)',
        destination: 'Seattle (SEA)',
        departureTime: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        arrivalTime: new Date(now.getTime() + 14 * 60 * 60 * 1000),
        price: 180,
        aircraft: 'Embraer 175',
        gate: 'C4',
        totalSeats: 30,
        availableSeats: 18,
        seatMap: buildSeatMap(30),
      },
    ]);

    res.json({ message: 'Flights seeded', flights });
  } catch (error) {
    res.status(500).json({ message: 'Unable to seed flights', error: error.message });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const data = { ...req.body };
    data.totalSeats = data.totalSeats || 60;
    data.availableSeats = data.availableSeats ?? data.totalSeats;
    data.seatMap = data.seatMap?.length ? data.seatMap : buildSeatMap(data.totalSeats);
    const flight = await Flight.create(data);
    res.status(201).json({ message: 'Flight created', flight });
  } catch (error) {
    res.status(400).json({ message: 'Unable to create flight', error: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    
    // Ensure dates are properly formatted
    if (data.departureTime) {
      data.departureTime = new Date(data.departureTime);
    }
    if (data.arrivalTime) {
      data.arrivalTime = new Date(data.arrivalTime);
    }
    
    // Ensure numeric fields are numbers
    if (data.price) {
      data.price = Number(data.price);
    }
    if (data.totalSeats) {
      data.totalSeats = Number(data.totalSeats);
    }
    
    // If totalSeats is being updated, regenerate seat map
    if (data.totalSeats && !data.seatMap) {
      data.seatMap = buildSeatMap(data.totalSeats);
    }

    const flight = await Flight.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Recalculate available seats based on actual bookings
    await recalculateAvailableSeats(id);
    
    // Fetch updated flight with correct available seats
    const updatedFlight = await Flight.findById(id);
    res.json({ message: 'Flight updated successfully', flight: updatedFlight });
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(400).json({ message: 'Unable to update flight', error: error.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findByIdAndDelete(id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json({ message: 'Flight deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Unable to delete flight', error: error.message });
  }
};

exports.getSeatMap = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    
    // Recalculate available seats to ensure accuracy
    await recalculateAvailableSeats(id);
    
    // Fetch updated flight
    const updatedFlight = await Flight.findById(id);
    
    const bookings = await Booking.find({ flight: id, status: 'CONFIRMED' }).select(
      'seatNumbers'
    );
    const reservedSeats = bookings.flatMap((b) => b.seatNumbers);
    
    res.json({ 
      seatMap: updatedFlight.seatMap, 
      reservedSeats, 
      availableSeats: updatedFlight.availableSeats,
      totalSeats: updatedFlight.totalSeats 
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch seat map', error: error.message });
  }
};

// Sync available seats for a specific flight (admin only)
exports.syncFlightSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const beforeSeats = flight.availableSeats;
    const afterSeats = await recalculateAvailableSeats(id);
    
    res.json({ 
      message: 'Seats synchronized successfully',
      before: beforeSeats,
      after: afterSeats,
      flight: await Flight.findById(id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to sync seats', error: error.message });
  }
};

// Sync all flights (admin only)
exports.syncAllFlightsSeats = async (req, res) => {
  try {
    const flights = await Flight.find();
    const results = [];

    for (const flight of flights) {
      const beforeSeats = flight.availableSeats;
      const afterSeats = await recalculateAvailableSeats(flight._id);
      if (beforeSeats !== afterSeats) {
        results.push({
          flightId: flight._id,
          flightNumber: flight.flightNumber,
          before: beforeSeats,
          after: afterSeats,
        });
      }
    }

    res.json({ 
      message: `Synchronized ${flights.length} flights`,
      updated: results.length,
      results 
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to sync all flights', error: error.message });
  }
};

