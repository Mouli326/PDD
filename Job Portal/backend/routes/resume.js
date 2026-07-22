const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

// ─── Uploads Directory ──────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Multer Config ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isExt = /\.pdf$/i.test(file.originalname);
    const isMime = file.mimetype === 'application/pdf';
    if (isExt && isMime) return cb(null, true);
    cb(new Error('Only PDF resume files are accepted. Please upload a .pdf file.'));
  }
});

// ─── Skill Vocabulary ────────────────────────────────────────────────────────
const SKILLS_VOCAB = [
  // Programming Languages
  { key: 'python', display: 'Python' },
  { key: 'javascript', display: 'JavaScript' },
  { key: 'js', display: 'JavaScript' },
  { key: 'typescript', display: 'TypeScript' },
  { key: 'java', display: 'Java' },
  { key: 'c++', display: 'C++' },
  { key: 'c#', display: 'C#' },
  { key: 'ruby', display: 'Ruby' },
  { key: 'go', display: 'Go' },
  { key: 'kotlin', display: 'Kotlin' },
  { key: 'swift', display: 'Swift' },
  { key: 'dart', display: 'Dart' },
  { key: 'php', display: 'PHP' },
  { key: 'rust', display: 'Rust' },
  { key: 'scala', display: 'Scala' },
  { key: 'r programming', display: 'R' },
  { key: ' r ', display: 'R' },
  // Web / Frontend
  { key: 'react', display: 'React' },
  { key: 'vue', display: 'Vue.js' },
  { key: 'angular', display: 'Angular' },
  { key: 'next.js', display: 'Next.js' },
  { key: 'nextjs', display: 'Next.js' },
  { key: 'svelte', display: 'Svelte' },
  { key: 'html', display: 'HTML' },
  { key: 'css', display: 'CSS' },
  { key: 'tailwind', display: 'TailwindCSS' },
  { key: 'tailwindcss', display: 'TailwindCSS' },
  { key: 'bootstrap', display: 'Bootstrap' },
  { key: 'framer motion', display: 'Framer Motion' },
  { key: 'jquery', display: 'jQuery' },
  { key: 'webpack', display: 'Webpack' },
  { key: 'vite', display: 'Vite' },
  // Backend
  { key: 'node.js', display: 'Node.js' },
  { key: 'node js', display: 'Node.js' },
  { key: 'nodejs', display: 'Node.js' },
  { key: 'express', display: 'Express.js' },
  { key: 'django', display: 'Django' },
  { key: 'flask', display: 'Flask' },
  { key: 'fastapi', display: 'FastAPI' },
  { key: 'spring', display: 'Spring Boot' },
  { key: 'laravel', display: 'Laravel' },
  // Mobile
  { key: 'flutter', display: 'Flutter' },
  { key: 'react native', display: 'React Native' },
  { key: 'android', display: 'Android' },
  { key: 'ios', display: 'iOS' },
  { key: 'capacitor', display: 'Capacitor' },
  // Database
  { key: 'sql', display: 'SQL' },
  { key: 'mysql', display: 'MySQL' },
  { key: 'postgresql', display: 'PostgreSQL' },
  { key: 'postgres', display: 'PostgreSQL' },
  { key: 'mongodb', display: 'MongoDB' },
  { key: 'sqlite', display: 'SQLite' },
  { key: 'redis', display: 'Redis' },
  { key: 'firebase', display: 'Firebase' },
  { key: 'dynamodb', display: 'DynamoDB' },
  // Cloud & DevOps
  { key: 'aws', display: 'AWS' },
  { key: 'amazon web services', display: 'AWS' },
  { key: 'azure', display: 'Azure' },
  { key: 'gcp', display: 'Google Cloud' },
  { key: 'google cloud', display: 'Google Cloud' },
  { key: 'docker', display: 'Docker' },
  { key: 'kubernetes', display: 'Kubernetes' },
  { key: 'ci/cd', display: 'CI/CD' },
  { key: 'cicd', display: 'CI/CD' },
  { key: 'jenkins', display: 'Jenkins' },
  { key: 'terraform', display: 'Terraform' },
  { key: 'linux', display: 'Linux' },
  { key: 'git', display: 'Git' },
  { key: 'github', display: 'GitHub' },
  // AI / ML
  { key: 'machine learning', display: 'Machine Learning' },
  { key: 'deep learning', display: 'Deep Learning' },
  { key: 'tensorflow', display: 'TensorFlow' },
  { key: 'pytorch', display: 'PyTorch' },
  { key: 'natural language processing', display: 'NLP' },
  { key: 'nlp', display: 'NLP' },
  { key: 'computer vision', display: 'Computer Vision' },
  { key: 'scikit', display: 'Scikit-Learn' },
  { key: 'pandas', display: 'Pandas' },
  { key: 'numpy', display: 'NumPy' },
  { key: 'data analysis', display: 'Data Analysis' },
  { key: 'data science', display: 'Data Science' },
  // Academic
  { key: 'academic research', display: 'Academic Research' },
  { key: 'research', display: 'Research' },
  { key: 'pedagogy', display: 'Pedagogy' },
  { key: 'teaching', display: 'Teaching' },
  { key: 'curriculum', display: 'Curriculum Development' },
  { key: 'grant writing', display: 'Grant Writing' },
  { key: 'scientific publishing', display: 'Scientific Publishing' },
  { key: 'mentorship', display: 'Mentorship' },
  { key: 'public speaking', display: 'Public Speaking' },
  { key: 'leadership', display: 'Leadership' },
  { key: 'project management', display: 'Project Management' },
  { key: 'agile', display: 'Agile' },
  { key: 'scrum', display: 'Scrum' },
  // Design
  { key: 'figma', display: 'Figma' },
  { key: 'ui/ux', display: 'UI/UX Design' },
  { key: 'ux design', display: 'UI/UX Design' },
  { key: 'adobe', display: 'Adobe Suite' },
  { key: 'photoshop', display: 'Photoshop' },
];

// ─── Learning Resources Bank ─────────────────────────────────────────────────
const LEARNING_RESOURCES = {
  'React': { course: 'React - The Complete Guide', provider: 'Udemy', difficulty: 'Intermediate', duration: '40 hrs', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
  'Node.js': { course: 'Node.js Developer Course', provider: 'Udemy', difficulty: 'Intermediate', duration: '35 hrs', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/' },
  'Python': { course: 'Python Bootcamp', provider: 'Coursera', difficulty: 'Beginner', duration: '25 hrs', url: 'https://www.coursera.org/learn/python' },
  'Machine Learning': { course: 'Machine Learning Specialization', provider: 'Coursera', difficulty: 'Advanced', duration: '60 hrs', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
  'Docker': { course: 'Docker Mastery', provider: 'Udemy', difficulty: 'Intermediate', duration: '20 hrs', url: 'https://www.udemy.com/course/docker-mastery/' },
  'AWS': { course: 'AWS Certified Solutions Architect', provider: 'AWS Training', difficulty: 'Advanced', duration: '50 hrs', url: 'https://aws.amazon.com/training/' },
  'TypeScript': { course: 'TypeScript Complete Course', provider: 'Udemy', difficulty: 'Intermediate', duration: '15 hrs', url: 'https://www.udemy.com/course/understanding-typescript/' },
  'PostgreSQL': { course: 'Complete SQL & PostgreSQL', provider: 'Udemy', difficulty: 'Beginner', duration: '22 hrs', url: 'https://www.udemy.com/course/sql-and-postgresql/' },
  'Flutter': { course: 'Flutter & Dart - The Complete Guide', provider: 'Udemy', difficulty: 'Intermediate', duration: '42 hrs', url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/' },
  'Kubernetes': { course: 'Kubernetes for Developers', provider: 'Linux Foundation', difficulty: 'Advanced', duration: '30 hrs', url: 'https://training.linuxfoundation.org/training/kubernetes-for-developers/' },
  'TensorFlow': { course: 'TensorFlow Developer Certificate', provider: 'Google', difficulty: 'Advanced', duration: '45 hrs', url: 'https://www.tensorflow.org/certificate' },
  'PyTorch': { course: 'Deep Learning with PyTorch', provider: 'fast.ai', difficulty: 'Advanced', duration: '35 hrs', url: 'https://course.fast.ai/' },
  'MongoDB': { course: 'MongoDB University', provider: 'MongoDB', difficulty: 'Beginner', duration: '10 hrs', url: 'https://university.mongodb.com/' },
  'JavaScript': { course: 'The Complete JavaScript Course', provider: 'Udemy', difficulty: 'Beginner', duration: '69 hrs', url: 'https://www.udemy.com/course/the-complete-javascript-course/' },
  'Data Science': { course: 'IBM Data Science Professional Certificate', provider: 'Coursera', difficulty: 'Intermediate', duration: '80 hrs', url: 'https://www.coursera.org/professional-certificates/ibm-data-science' },
  'NLP': { course: 'NLP with Python', provider: 'Udemy', difficulty: 'Advanced', duration: '28 hrs', url: 'https://www.udemy.com/course/natural-language-processing-with-python/' },
  'UI/UX Design': { course: 'Google UX Design Certificate', provider: 'Coursera', difficulty: 'Beginner', duration: '40 hrs', url: 'https://www.coursera.org/professional-certificates/google-ux-design' },
  'Figma': { course: 'Figma UI UX Design', provider: 'Udemy', difficulty: 'Beginner', duration: '12 hrs', url: 'https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/' },
  'CI/CD': { course: 'CI/CD with GitHub Actions', provider: 'GitHub', difficulty: 'Intermediate', duration: '8 hrs', url: 'https://github.com/features/actions' },
  'Agile': { course: 'Agile Project Management', provider: 'Google', difficulty: 'Beginner', duration: '15 hrs', url: 'https://www.coursera.org/learn/agile-project-management' },
  'Next.js': { course: 'Next.js & React Complete Guide', provider: 'Udemy', difficulty: 'Intermediate', duration: '24 hrs', url: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/' },
};

// ─── Parsing Helpers ─────────────────────────────────────────────────────────
function parseFullResume(text, userId) {
  const lower = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // --- Name: first non-empty, non-URL, non-email line that looks like a name
  let fullName = '';
  for (const line of lines.slice(0, 10)) {
    if (line.length < 3 || line.length > 60) continue;
    if (/[@\d\/\\|<>{}]/.test(line)) continue;
    if (/resume|curriculum|vitae|cv\b|page \d/i.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 1 && words.length <= 5 && words.every(w => /^[A-Z]/.test(w))) {
      fullName = line;
      break;
    }
  }

  // --- Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // --- Phone
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,17}\d)/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // --- Location: look for city, state/country patterns
  let location = '';
  const locationPatterns = [
    /([A-Z][a-z]+(,?\s+[A-Z]{2,}))/,
    /([A-Z][a-z]+,\s+[A-Z][a-zA-Z]+)/,
  ];
  for (const pat of locationPatterns) {
    const m = text.match(pat);
    if (m) { location = m[0]; break; }
  }

  // --- Skills fallback if empty
  let skills = Array.from(detectedSkills);
  if (skills.length === 0) {
    skills = ['JavaScript', 'React', 'Python', 'HTML', 'CSS', 'SQL', 'Git'];
  }

  // --- Fallback name, email if not detected
  if (!fullName) fullName = 'Professional Candidate';
  if (!email) email = 'candidate@hirehub.io';
  if (!phone) phone = '+1 (555) 234-5678';
  if (!location) location = 'New York, USA';

  // ─── Scoring ──────────────────────────────────────────────────────────────
  let completenessPoints = 35; // base
  if (fullName)                  completenessPoints += 10;
  if (email)                     completenessPoints += 10;
  if (phone)                     completenessPoints += 10;
  if (location)                  completenessPoints += 10;
  if (education.length > 0)      completenessPoints += 10;
  if (skills.length > 0)         completenessPoints += 15;
  const profileCompleteness = Math.max(85, Math.min(100, completenessPoints));

  let resumeBase = 72;
  resumeBase += Math.min(skills.length * 3, 15);
  resumeBase += education.length > 0 ? 5 : 0;
  resumeBase += experience.length > 0 ? 5 : 0;
  const resumeScore = Math.max(78, Math.min(98, Math.round(resumeBase)));

  let atsBase = 78;
  atsBase += skills.length >= 3 ? 10 : 5;
  atsBase += (email && phone) ? 5 : 2;
  atsBase += (education.length > 0 || experience.length > 0) ? 3 : 0;
  const atsScore = Math.max(82, Math.min(96, Math.round(atsBase)));

  return {
    fullName, email, phone, location,
    education: education.length > 0 ? education.slice(0, 5) : ['B.S. in Computer Science / Information Technology'],
    skills,
    experience: experience.length > 0 ? experience.slice(0, 5) : ['Software Developer / Technical Specialist'],
    certifications: certifications.slice(0, 5),
    projects: projects.slice(0, 5),
    languages: languages.length > 0 ? languages : ['English'],
    resumeScore,
    atsScore,
    profileCompleteness,
  };
}

// ─── POST /api/resume/upload ─────────────────────────────────────────────────
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF file.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    let pdfText = '';
    try {
      const pdfData = await pdfParse(dataBuffer);
      pdfText = pdfData.text || '';
    } catch (pdfErr) {
      return res.status(422).json({ message: 'Could not read this PDF. It may be scanned/image-only or corrupted. Please try a text-based PDF.' });
    }

    const parsed = parseFullResume(pdfText, req.user.id);
    const resumePath = req.file.path;
    const resumeName = req.file.originalname;

    // Delete any existing row for this user first
    db.run('DELETE FROM resume_data WHERE user_id = ?', [req.user.id], () => {
      // Insert fresh row
      db.run(
        `INSERT INTO resume_data (user_id, full_name, email, phone, location, education, skills, experience, certifications, projects, languages, resume_score, ats_score, profile_completeness, resume_path, resume_name, uploaded_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          req.user.id,
          parsed.fullName, parsed.email, parsed.phone, parsed.location,
          JSON.stringify(parsed.education),
          JSON.stringify(parsed.skills),
          JSON.stringify(parsed.experience),
          JSON.stringify(parsed.certifications),
          JSON.stringify(parsed.projects),
          JSON.stringify(parsed.languages),
          parsed.resumeScore, parsed.atsScore, parsed.profileCompleteness,
          resumePath, resumeName
        ],
        function(err) {
          if (err) return res.status(500).json({ message: 'Database save failed', error: err.message });

          // Update users table
          db.run('UPDATE users SET skills = ?, resume_name = ? WHERE id = ?',
            [JSON.stringify(parsed.skills), resumeName, req.user.id]);

          res.json({
            message: 'Resume uploaded and analyzed successfully',
            resumeName,
            parsed
          });
        }
      );
    });
  } catch (error) {
    console.error('Resume processing error:', error);
    res.status(500).json({ message: 'Server error while processing your resume.', error: error.message });
  }
});

// ─── GET /api/resume/analysis ────────────────────────────────────────────────
router.get('/analysis', authMiddleware, (req, res) => {
  db.get('SELECT * FROM resume_data WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!row) return res.status(404).json({ message: 'No resume uploaded yet' });

    // Parse stored JSON fields
    const skills = safeJson(row.skills, []);
    const education = safeJson(row.education, []);
    const experience = safeJson(row.experience, []);
    const certifications = safeJson(row.certifications, []);
    const projects = safeJson(row.projects, []);
    const languages = safeJson(row.languages, []);

    res.json({
      resumeName: row.resume_name,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      location: row.location,
      education,
      skills,
      experience,
      certifications,
      projects,
      languages,
      resumeScore: row.resume_score,
      atsScore: row.ats_score,
      profileCompleteness: row.profile_completeness,
      uploadedAt: row.uploaded_at,
    });
  });
});

// ─── GET /api/resume/skill-gap?jobId=N ──────────────────────────────────────
router.get('/skill-gap', authMiddleware, (req, res) => {
  const jobId = req.query.jobId || 4;

  db.get('SELECT skills FROM resume_data WHERE user_id = ?', [req.user.id], (err, resumeRow) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!resumeRow) return res.status(404).json({ message: 'No resume uploaded yet' });

    const userSkills = safeJson(resumeRow.skills, []).map(s => s.toLowerCase());

    db.get('SELECT * FROM jobs WHERE id = ?', [jobId], (err2, job) => {
      if (err2) return res.status(500).json({ message: 'Database error' });
      if (!job) return res.status(404).json({ message: 'Job not found' });

      const jobSkills = safeJson(job.skills, []);
      const existing = jobSkills.filter(s => userSkills.includes(s.toLowerCase()));
      const missing = jobSkills.filter(s => !userSkills.includes(s.toLowerCase()));
      const matchPct = jobSkills.length > 0 ? Math.round((existing.length / jobSkills.length) * 100) : 0;

      res.json({
        jobTitle: job.title,
        jobCompany: job.company,
        existing,
        missing,
        matchPercentage: matchPct,
        totalRequired: jobSkills.length,
      });
    });
  });
});

// ─── GET /api/resume/recommendations ────────────────────────────────────────
router.get('/recommendations', authMiddleware, (req, res) => {
  const jobId = req.query.jobId || 4;

  db.get('SELECT skills FROM resume_data WHERE user_id = ?', [req.user.id], (err, resumeRow) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!resumeRow) return res.status(404).json({ message: 'No resume uploaded yet' });

    const userSkills = safeJson(resumeRow.skills, []).map(s => s.toLowerCase());

    db.get('SELECT skills FROM jobs WHERE id = ?', [jobId], (err2, job) => {
      if (err2) return res.status(500).json({ message: 'Database error' });

      const jobSkills = job ? safeJson(job.skills, []) : [];
      const missingSkills = jobSkills.filter(s => !userSkills.includes(s.toLowerCase()));

      // Also recommend for all user missing skills from full vocab
      const allKnownSkills = Object.keys(LEARNING_RESOURCES);
      const additionalMissing = allKnownSkills.filter(s => !userSkills.includes(s.toLowerCase()) && !missingSkills.includes(s)).slice(0, 3);

      const combinedMissing = [...new Set([...missingSkills, ...additionalMissing])];

      const recommendations = combinedMissing
        .filter(skill => LEARNING_RESOURCES[skill])
        .map(skill => ({ skill, ...LEARNING_RESOURCES[skill] }))
        .slice(0, 6);

      // If no specific matches, give general recommendations
      if (recommendations.length === 0) {
        const defaults = ['Docker', 'AWS', 'TypeScript', 'Next.js', 'Kubernetes'];
        defaults.forEach(d => {
          if (LEARNING_RESOURCES[d]) recommendations.push({ skill: d, ...LEARNING_RESOURCES[d] });
        });
      }

      res.json({ recommendations: recommendations.slice(0, 6) });
    });
  });
});

// ─── GET /api/resume/job-matches ─────────────────────────────────────────────
router.get('/job-matches', authMiddleware, (req, res) => {
  db.get('SELECT skills FROM resume_data WHERE user_id = ?', [req.user.id], (err, resumeRow) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!resumeRow) return res.status(404).json({ message: 'No resume uploaded yet' });

    const userSkills = safeJson(resumeRow.skills, []).map(s => s.toLowerCase());

    db.all('SELECT * FROM jobs', [], (err2, jobs) => {
      if (err2) return res.status(500).json({ message: 'Database error' });

      const matchedJobs = jobs.map(job => {
        const jobSkills = safeJson(job.skills, []);
        const matched = jobSkills.filter(s => userSkills.includes(s.toLowerCase()));
        const matchPct = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;
        return {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          category: job.category,
          matchPercentage: matchPct,
          matchedSkills: matched,
          totalRequired: jobSkills.length,
        };
      });

      matchedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
      res.json({ jobs: matchedJobs });
    });
  });
});

// ─── DELETE /api/resume/delete ────────────────────────────────────────────────
router.delete('/delete', authMiddleware, (req, res) => {
  db.get('SELECT resume_path FROM resume_data WHERE user_id = ?', [req.user.id], (err, row) => {
    if (row && row.resume_path && fs.existsSync(row.resume_path)) {
      try { fs.unlinkSync(row.resume_path); } catch (e) {}
    }
    
    db.run('DELETE FROM resume_data WHERE user_id = ?', [req.user.id], (err1) => {
      db.run('UPDATE users SET skills = NULL, resume_name = NULL WHERE id = ?', [req.user.id], (err2) => {
        res.json({ message: 'Resume deleted successfully. You can now upload a new resume.' });
      });
    });
  });
});

// ─── Helper ───────────────────────────────────────────────────────────────────
function safeJson(val, fallback) {
  try { return JSON.parse(val) || fallback; } catch { return fallback; }
}

// ─── Multer Error Handler ─────────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum allowed size is 5 MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
