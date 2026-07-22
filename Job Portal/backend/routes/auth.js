const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'elevate_career_secret_token_12345';

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;

        // Insert user into DB
        db.run(
          `INSERT INTO users (name, email, password_hash, role, skills, resume_name) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [name, email, hash, role, null, null],
          function (err) {
            if (err) {
              return res.status(500).json({ message: 'Failed to create user', error: err.message });
            }

            const userId = this.lastID;

            // Create token
            jwt.sign(
              { id: userId, email, role },
              JWT_SECRET,
              { expiresIn: '7d' },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: userId,
                    name,
                    email,
                    role,
                    skills: null,
                    resume_name: null
                  }
                });
              }
            );
          }
        );
      });
    });
  });
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Find user
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create token
      jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              skills: user.skills ? JSON.parse(user.skills) : null,
              resume_name: user.resume_name
            }
          });
        }
      );
    });
  });
});

// @route   GET api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authMiddleware, (req, res) => {
  db.get('SELECT id, name, email, role, skills, resume_name FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills ? JSON.parse(user.skills) : null,
      resume_name: user.resume_name
    });
  });
});

// @route   PUT api/auth/add-skill
// @desc    Add a verified skill credential to profile
// @access  Private
router.put('/add-skill', authMiddleware, (req, res) => {
  const { skill } = req.body;
  if (!skill) {
    return res.status(400).json({ message: 'Skill name is required' });
  }

  db.get('SELECT skills FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let skills = user.skills ? JSON.parse(user.skills) : [];
    if (!Array.isArray(skills)) {
      skills = [];
    }

    // Add unique skill
    if (!skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      skills.push(skill);
    }

    db.run(
      'UPDATE users SET skills = ? WHERE id = ?',
      [JSON.stringify(skills), req.user.id],
      function (err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to update skills', error: err.message });
        }
        res.json({
          message: 'Skill credential registered successfully',
          skills
        });
      }
    );
  });
});

module.exports = router;
