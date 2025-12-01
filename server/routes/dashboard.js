const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// GET /api/dashboard - Basic dashboard endpoint (skeleton for Task-3)
// This is a simple landing page after login/registration
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Simple welcome message - full dashboard implementation will be done later
    res.json({
      message: 'Welcome to the dashboard',
      userId: req.user.userId,
      email: req.user.email
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

