const express = require('express');
const { getManual, updateManual } = require('../controllers/manualController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get manual (public or authenticated)
router.get('/', getManual);

// Update manual (admin only)
router.put('/', requireAuth, requireAdmin, updateManual);

module.exports = router;

