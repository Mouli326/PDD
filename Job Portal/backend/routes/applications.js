const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

// @route   POST api/applications
// @desc    Submit a job application
// @access  Private
router.post('/', authMiddleware, (req, res) => {
  const { jobId, name, email, statementOfPurpose } = req.body;

  if (!jobId || !name || !email || !statementOfPurpose) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Find user's resume name
  db.get('SELECT resume_name FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    const resumeName = user ? user.resume_name : null;

    db.run(
      `INSERT INTO applications (user_id, job_id, name, email, statement_of_purpose, resume_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, jobId, name, email, statementOfPurpose, resumeName],
      function (err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to submit application', error: err.message });
        }

        const applicationId = this.lastID;

        // Fetch target job info
        db.get('SELECT title, company FROM jobs WHERE id = ?', [jobId], (err, job) => {
          res.json({
            id: applicationId,
            jobId,
            jobTitle: job ? job.title : 'Position',
            jobCompany: job ? job.company : 'Company',
            name,
            email,
            statementOfPurpose,
            resumeName,
            status: 'Applied',
            createdAt: new Date().toISOString()
          });
        });
      }
    );
  });
});

// @route   GET api/applications
// @desc    Get user's application history
// @access  Private
router.get('/', authMiddleware, (req, res) => {
  db.all(
    `SELECT a.id, a.job_id as jobId, a.name, a.email, a.statement_of_purpose as statementOfPurpose, 
            a.resume_name as resumeName, a.status, a.created_at as createdAt, 
            j.title as jobTitle, j.company as jobCompany, j.location as jobLocation, j.salary as jobSalary
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     WHERE a.user_id = ?
     ORDER BY a.created_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
