const express = require('express');
const {
  listFlights,
  seedFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  getSeatMap,
  syncFlightSeats,
  syncAllFlightsSeats,
} = require('../controllers/flightController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', listFlights);
router.get('/:id/seats', requireAuth, getSeatMap);
router.post('/seed', requireAuth, requireRole('admin'), seedFlights);
router.post('/', requireAuth, requireRole('admin'), createFlight);
router.put('/:id', requireAuth, requireRole('admin'), updateFlight);
router.delete('/:id', requireAuth, requireRole('admin'), deleteFlight);
router.post('/:id/sync-seats', requireAuth, requireRole('admin'), syncFlightSeats);
router.post('/sync-all-seats', requireAuth, requireRole('admin'), syncAllFlightsSeats);

module.exports = router;

