const express = require('express');
const router = express.Router();
const db = require('../db/database');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', (req, res) => {
  const { category } = req.query;

  let query = 'SELECT * FROM jobs';
  const params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    // Parse JSON string skills
    const jobs = rows.map(row => ({
      ...row,
      skills: JSON.parse(row.skills)
    }));

    res.json(jobs);
  });
});

// @route   GET api/jobs/:id
// @desc    Get a single job
// @access  Public
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      ...row,
      skills: JSON.parse(row.skills)
    });
  });
});

module.exports = router;
