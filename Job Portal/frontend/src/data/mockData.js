export const JOBS = [
  {
    id: 1,
    title: "Assistant Professor of Computer Science (AI & Robotics)",
    company: "State University of Technology",
    location: "Boston, MA (Hybrid)",
    salary: "$115,000 - $140,000 / year",
    skills: ["Machine Learning", "Academic Research", "Pedagogy", "Grant Writing", "Python"],
    matchScore: 94,
    description: "Lead undergraduate lectures, conduct state-of-the-art research in machine learning, and publish in top-tier journals (NeurIPS, CVPR).",
    category: "academia"
  },
  {
    id: 2,
    title: "Senior Research Scientist & Adjunct Professor",
    company: "Global AI Institute & University",
    location: "San Francisco, CA",
    salary: "$160,000 - $195,000 / year",
    skills: ["Natural Language Processing", "Scientific Publishing", "Mentorship", "TensorFlow", "PyTorch"],
    matchScore: 87,
    description: "Supervise doctoral candidates, publish cutting-edge LLM architectures, and secure research grants.",
    category: "academia"
  },
  {
    id: 3,
    title: "Dean of Engineering & Computer Science",
    company: "Vanguard University",
    location: "London, UK",
    salary: "£120,000 - £150,000 / year",
    skills: ["Academic Administration", "Curriculum Development", "Strategic Leadership", "Public Speaking"],
    matchScore: 78,
    description: "Define the academic and operational vision for the College of Engineering and foster corporate partnerships.",
    category: "academia"
  },
  {
    id: 4,
    title: "Senior Full Stack Developer",
    company: "TechNova Solutions",
    location: "Remote / New York",
    salary: "$120k - $160k",
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    matchScore: 95,
    description: "Lead our engineering team in building scalable cloud-native applications.",
    category: "industry"
  },
  {
    id: 5,
    title: "AI/ML Engineer",
    company: "FutureMind AI",
    location: "San Francisco, CA",
    salary: "$140k - $180k",
    skills: ["Python", "PyTorch", "NLP", "TensorFlow"],
    matchScore: 82,
    description: "Develop cutting-edge LLM-based features for our enterprise platform.",
    category: "industry"
  },
  {
    id: 6,
    title: "Frontend Architect",
    company: "DesignCo",
    location: "London, UK",
    salary: "£70k - £90k",
    skills: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
    matchScore: 78,
    description: "Define the visual and technical direction of our user interface system.",
    category: "industry"
  }
];

export const SKILL_GAPS = {
  1: {
    userSkills: ["Machine Learning", "Python", "Deep Learning", "Public Speaking"],
    targetJob: "Assistant Professor of Computer Science",
    missingSkills: [
      { name: "Academic Research & Publishing", importance: "High", resource: "https://www.ieee.org/publications/index.html" },
      { name: "Grant Writing & Proposal Drafting", importance: "High", resource: "https://new.nsf.gov/funding/how-to-apply" },
      { name: "Pedagogy & Classroom Instruction", importance: "Medium", resource: "https://www.coursera.org/specializations/university-teaching" }
    ],
    learningResources: [
      { title: "Academic Grant Writing Masterclass", provider: "AcademicEdu", type: "Video Course", rating: 4.9 },
      { title: "Pedagogy & University Teaching Methodologies", provider: "Coursera", type: "Specialization", rating: 4.8 },
      { title: "Navigating Peer Review & Journal Publishing", provider: "IEEE Education", type: "Certification", rating: 4.7 }
    ]
  },
  2: {
    userSkills: ["Machine Learning", "Python", "Deep Learning", "Public Speaking"],
    targetJob: "Senior Research Scientist & Adjunct Professor",
    missingSkills: [
      { name: "Natural Language Processing", importance: "High", resource: "https://www.coursera.org/learn/natural-language-processing" },
      { name: "Scientific Publishing", importance: "High", resource: "https://www.nature.com/nature/for-authors" },
      { name: "Doctoral Mentorship", importance: "Medium", resource: "https://www.ox.ac.uk/students/academic/guidance/graduate/mentoring" }
    ],
    learningResources: [
      { title: "Natural Language Processing Specialization", provider: "DeepLearning.AI", type: "Course Series", rating: 4.9 },
      { title: "Mentorship & Academic Leadership", provider: "Harvard Online", type: "Course", rating: 4.8 }
    ]
  },
  3: {
    userSkills: ["Machine Learning", "Python", "Deep Learning", "Public Speaking"],
    targetJob: "Dean of Engineering & Computer Science",
    missingSkills: [
      { name: "Academic Administration", importance: "High", resource: "https://www.edx.org/learn/educational-leadership" },
      { name: "Curriculum Development", importance: "High", resource: "https://www.coursera.org/courses?query=curriculum-development" },
      { name: "Strategic Leadership", importance: "High", resource: "https://www.coursera.org/learn/strategic-leadership" }
    ],
    learningResources: [
      { title: "Strategic Leadership in Higher Education", provider: "Vanguard", type: "Executive Program", rating: 4.9 },
      { title: "Academic Administration & Policy", provider: "EdX", type: "Certification", rating: 4.7 }
    ]
  },
  4: {
    userSkills: ["React", "Javascript", "CSS", "HTML"],
    targetJob: "Senior Full Stack Developer",
    missingSkills: [
      { name: "Node.js", importance: "High", resource: "https://nodejs.org/en/learn" },
      { name: "PostgreSQL", importance: "Medium", resource: "https://www.postgresql.org/docs/" },
      { name: "AWS", importance: "Medium", resource: "https://aws.amazon.com/training/" }
    ],
    learningResources: [
      { title: "Node.js Backend Bootcamp", provider: "Udemy", type: "Video Course", rating: 4.8 },
      { title: "SQL for Web Developers", provider: "Coursera", type: "Course", rating: 4.9 },
      { title: "Cloud Computing with AWS", provider: "AWS Training", type: "Certification", rating: 4.7 }
    ]
  },
  5: {
    userSkills: ["React", "Javascript", "CSS", "HTML"],
    targetJob: "AI/ML Engineer",
    missingSkills: [
      { name: "Python", importance: "High", resource: "https://www.python.org/" },
      { name: "PyTorch & TensorFlow", importance: "High", resource: "https://pytorch.org/" },
      { name: "Mathematical Foundations of AI", importance: "High", resource: "https://www.coursera.org/specializations/mathematics-machine-learning" }
    ],
    learningResources: [
      { title: "Mathematics for Machine Learning", provider: "Imperial College London", type: "Course Series", rating: 4.9 },
      { title: "Deep Learning Specialization", provider: "DeepLearning.AI", type: "Course Series", rating: 4.8 }
    ]
  },
  6: {
    userSkills: ["React", "Javascript", "CSS", "HTML"],
    targetJob: "Frontend Architect",
    missingSkills: [
      { name: "TypeScript", importance: "High", resource: "https://www.typescriptlang.org/" },
      { name: "Framer Motion (Advanced)", importance: "Medium", resource: "https://www.framer.com/motion/" },
      { name: "System Design for Frontends", importance: "High", resource: "https://www.educative.io/courses/grokking-the-frontend-system-design-interview" }
    ],
    learningResources: [
      { title: "Frontend System Design", provider: "DesignCo Academy", type: "Masterclass", rating: 4.9 },
      { title: "TypeScript Production Scale Applications", provider: "Frontend Masters", type: "Course", rating: 4.8 }
    ]
  }
};
