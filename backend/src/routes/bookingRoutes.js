const express = require('express');
const {
  createBooking,
  listMyBookings,
  listAllBookings,
  cancelBooking,
  getBooking,
} = require('../controllers/bookingController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, createBooking);
router.get('/', requireAuth, listMyBookings);
router.get('/all', requireAuth, requireRole('admin'), listAllBookings);
router.get('/:id', requireAuth, getBooking);
router.delete('/:id', requireAuth, cancelBooking);

module.exports = router;

