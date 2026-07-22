const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = __dirname;
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'elevate.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // 1. Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        skills TEXT, -- Comma-separated or JSON list of parsed skills
        resume_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Jobs Table
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        salary TEXT NOT NULL,
        skills TEXT NOT NULL, -- JSON array of required skills
        description TEXT NOT NULL,
        category TEXT NOT NULL -- 'academia' or 'industry'
      )
    `, () => {
      seedJobs();
    });

    // 3. Applications Table
    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        job_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        statement_of_purpose TEXT NOT NULL,
        resume_name TEXT,
        status TEXT DEFAULT 'Applied',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (job_id) REFERENCES jobs (id)
      )
    `);

    // 4. Blockchain Ledger Table
    db.run(`
      CREATE TABLE IF NOT EXISTS blockchain_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        block_index INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        skills TEXT NOT NULL,
        previous_hash TEXT NOT NULL,
        block_hash TEXT NOT NULL,
        qr_code_hash TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // 5. Resume Data Table (full parsed resume intelligence)
    db.run(`
      CREATE TABLE IF NOT EXISTS resume_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        full_name TEXT,
        email TEXT,
        phone TEXT,
        location TEXT,
        education TEXT,        -- JSON array of education entries
        skills TEXT,           -- JSON array of detected skills
        experience TEXT,       -- JSON array of experience entries
        certifications TEXT,   -- JSON array of certifications
        projects TEXT,         -- JSON array of project names
        languages TEXT,        -- JSON array of languages
        resume_score INTEGER DEFAULT 0,
        ats_score INTEGER DEFAULT 0,
        skill_match INTEGER DEFAULT 0,
        profile_completeness INTEGER DEFAULT 0,
        resume_path TEXT,
        resume_name TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  });
}

function seedJobs() {
  db.get("SELECT COUNT(*) as count FROM jobs", [], (err, row) => {
    if (err) {
      console.error("Error checking jobs count:", err.message);
      return;
    }

    if (row.count === 0) {
      const initialJobs = [
        {
          id: 1,
          title: "Assistant Professor of Computer Science (AI & Robotics)",
          company: "State University of Technology",
          location: "Boston, MA (Hybrid)",
          salary: "$115,000 - $140,000 / year",
          skills: JSON.stringify(["Machine Learning", "Academic Research", "Pedagogy", "Grant Writing", "Python"]),
          description: "Lead undergraduate lectures, conduct state-of-the-art research in machine learning, and publish in top-tier journals (NeurIPS, CVPR).",
          category: "academia"
        },
        {
          id: 2,
          title: "Senior Research Scientist & Adjunct Professor",
          company: "Global AI Institute & University",
          location: "San Francisco, CA",
          salary: "$160,000 - $195,000 / year",
          skills: JSON.stringify(["Natural Language Processing", "Scientific Publishing", "Mentorship", "TensorFlow", "PyTorch"]),
          description: "Supervise doctoral candidates, publish cutting-edge LLM architectures, and secure research grants.",
          category: "academia"
        },
        {
          id: 3,
          title: "Dean of Engineering & Computer Science",
          company: "Vanguard University",
          location: "London, UK",
          salary: "£120,000 - £150,000 / year",
          skills: JSON.stringify(["Academic Administration", "Curriculum Development", "Strategic Leadership", "Public Speaking"]),
          description: "Define the academic and operational vision for the College of Engineering and foster corporate partnerships.",
          category: "academia"
        },
        {
          id: 4,
          title: "Senior Full Stack Developer",
          company: "TechNova Solutions",
          location: "Remote / New York",
          salary: "$120k - $160k",
          skills: JSON.stringify(["React", "Node.js", "PostgreSQL", "AWS", "JavaScript"]),
          description: "Lead our engineering team in building scalable cloud-native applications.",
          category: "industry"
        },
        {
          id: 5,
          title: "AI/ML Engineer",
          company: "FutureMind AI",
          location: "San Francisco, CA",
          salary: "$140k - $180k",
          skills: JSON.stringify(["Python", "PyTorch", "NLP", "TensorFlow", "Machine Learning"]),
          description: "Develop cutting-edge LLM-based features for our enterprise platform.",
          category: "industry"
        },
        {
          id: 6,
          title: "Frontend Architect",
          company: "DesignCo",
          location: "London, UK",
          salary: "£70k - £90k",
          skills: JSON.stringify(["React", "TypeScript", "TailwindCSS", "Framer Motion", "JavaScript"]),
          description: "Define the visual and technical direction of our user interface system.",
          category: "industry"
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO jobs (id, title, company, location, salary, skills, description, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      initialJobs.forEach(job => {
        stmt.run(job.id, job.title, job.company, job.location, job.salary, job.skills, job.description, job.category);
      });

      stmt.finalize();
      console.log("Seeded jobs table with mock openings.");
    }
  });
}

module.exports = db;
