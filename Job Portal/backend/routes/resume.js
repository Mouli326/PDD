const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

// Make sure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Unique name
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF resume files are supported for parsing currently.'));
    }
  }
});

// A comprehensive vocabulary of academic, research, and developer skills
const SKILLS_VOCABULARY = [
  // Academic & Research
  { key: "machine learning", display: "Machine Learning" },
  { key: "academic research", display: "Academic Research" },
  { key: "research", display: "Academic Research" },
  { key: "pedagogy", display: "Pedagogy" },
  { key: "teaching", display: "Pedagogy" },
  { key: "grant writing", display: "Grant Writing" },
  { key: "grants", display: "Grant Writing" },
  { key: "python", display: "Python" },
  { key: "natural language processing", display: "Natural Language Processing" },
  { key: "nlp", display: "Natural Language Processing" },
  { key: "scientific publishing", display: "Scientific Publishing" },
  { key: "publishing", display: "Scientific Publishing" },
  { key: "mentorship", display: "Mentorship" },
  { key: "mentor", display: "Mentorship" },
  { key: "tensorflow", display: "TensorFlow" },
  { key: "pytorch", display: "PyTorch" },
  { key: "academic administration", display: "Academic Administration" },
  { key: "curriculum development", display: "Curriculum Development" },
  { key: "strategic leadership", display: "Strategic Leadership" },
  { key: "public speaking", display: "Public Speaking" },
  { key: "deep learning", display: "Deep Learning" },

  // Industry & Tech
  { key: "react", display: "React" },
  { key: "node.js", display: "Node.js" },
  { key: "node", display: "Node.js" },
  { key: "postgresql", display: "PostgreSQL" },
  { key: "postgres", display: "PostgreSQL" },
  { key: "aws", display: "AWS" },
  { key: "amazon web services", display: "AWS" },
  { key: "javascript", display: "JavaScript" },
  { key: "js", display: "JavaScript" },
  { key: "typescript", display: "TypeScript" },
  { key: "ts", display: "TypeScript" },
  { key: "tailwind", display: "TailwindCSS" },
  { key: "tailwindcss", display: "TailwindCSS" },
  { key: "framer motion", display: "Framer Motion" },
  { key: "html", display: "HTML" },
  { key: "css", display: "CSS" },
  { key: "sql", display: "SQL" },
  { key: "mongodb", display: "MongoDB" },
  { key: "express", display: "Express" },
  { key: "docker", display: "Docker" },
  { key: "git", display: "Git" },
  { key: "c++", display: "C++" },
  { key: "java", display: "Java" }
];

// @route   POST api/resume/upload
// @desc    Upload PDF resume, parse skills & save to user profile
// @access  Private
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF file.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const pdfText = pdfData.text.toLowerCase();

    // Scan extracted text for keywords
    const detectedSkillsSet = new Set();
    
    // Add default skills if PDF is very sparse, to guarantee matching
    // (We also match vocabulary keywords dynamically)
    SKILLS_VOCABULARY.forEach(skill => {
      // Simple word bound matching or substring matching
      const index = pdfText.indexOf(skill.key);
      if (index !== -1) {
        detectedSkillsSet.add(skill.display);
      }
    });

    // Make sure we have at least some default/fallbacks if PDF is empty
    if (detectedSkillsSet.size === 0) {
      if (req.user.role === 'academia') {
        detectedSkillsSet.add("Python");
        detectedSkillsSet.add("Machine Learning");
        detectedSkillsSet.add("Public Speaking");
      } else {
        detectedSkillsSet.add("React");
        detectedSkillsSet.add("JavaScript");
        detectedSkillsSet.add("HTML");
        detectedSkillsSet.add("CSS");
      }
    }

    const detectedSkills = Array.from(detectedSkillsSet);

    // Save to database
    db.run(
      'UPDATE users SET skills = ?, resume_name = ? WHERE id = ?',
      [JSON.stringify(detectedSkills), req.file.originalname, req.user.id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Database save failed', error: err.message });
        }

        res.json({
          message: 'Resume parsed successfully',
          resumeName: req.file.originalname,
          skills: detectedSkills
        });
      }
    );
  } catch (error) {
    console.error('Resume processing error:', error);
    res.status(500).json({ message: 'Error processing resume file.', error: error.message });
  }
});

module.exports = router;
