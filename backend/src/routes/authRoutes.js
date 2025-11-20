const express = require('express');
const { register, login, profile, updateProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, profile);
router.put('/profile', requireAuth, updateProfile);

module.exports = router;

