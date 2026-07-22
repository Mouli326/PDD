const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize DB
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (just in case during split dev server usage)
app.use(cors());

// Parse JSON and URLEncoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/blockchain', require('./routes/blockchain'));

// Serve Frontend Static Build
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback Wildcard SPA Route (serves index.html for non-API frontend routing)
app.get('*', (req, res) => {
  // If the request expects JSON (like an api page that was not found), return 404 instead of index.html
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API Endpoint not found' });
  }
  
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Frontend build not compiled. Please run npm run build inside the frontend folder.');
    }
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`  HireHub: Job Portal Server Active               `);
  console.log(`  Running on URL: http://0.0.0.0:${PORT}          `);
  console.log(`==================================================`);
});
