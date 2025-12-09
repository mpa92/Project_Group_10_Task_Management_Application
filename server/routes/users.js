const express = require('express');
const router = express.Router();
  const pool = require('../config/db');

// TODO: Implement user routes
// GET /api/users - Get all users (for task assignment)
// GET /api/users/:id - Get a single user
// PUT /api/users/:id - Update user settings

router.get('/', async (req, res) => {
  const searchTerm = req.query.search || '';

  try {
    const result = await pool.query(`
      SELECT id, username, first_name, last_name
      FROM users
      WHERE first_name ILIKE $1
    `, [`%${searchTerm}%`]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  // TODO: Implement get single user
  res.json({ message: 'Get single user endpoint - to be implemented' });
});

router.put('/:id', async (req, res) => {
  // TODO: Implement update user settings
  res.json({ message: 'Update user endpoint - to be implemented' });
});

module.exports = router;

