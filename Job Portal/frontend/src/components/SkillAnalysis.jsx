import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api.js';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, BookOpen, ExternalLink, TrendingUp, HelpCircle } from 'lucide-react';

// Learning courses directory mapped to missing skills
const COURSES_DIRECTORY = {
  "academic research": {
    importance: "High",
    link: "https://www.ieee.org/publications/index.html",
    courses: [
      { title: "Navigating Peer Review & Journal Publishing", provider: "IEEE Education", type: "Certification", rating: 4.8 }
    ]
  },
  "pedagogy": {
    importance: "High",
    link: "https://www.coursera.org/specializations/university-teaching",
    courses: [
      { title: "Pedagogy & University Teaching Methodologies", provider: "Coursera", type: "Specialization", rating: 4.8 }
    ]
  },
  "grant writing": {
    importance: "Medium",
    link: "https://new.nsf.gov/funding/how-to-apply",
    courses: [
      { title: "Academic Grant Writing Masterclass", provider: "AcademicEdu", type: "Video Course", rating: 4.9 }
    ]
  },
  "natural language processing": {
    importance: "High",
    link: "https://www.coursera.org/learn/natural-language-processing",
    courses: [
      { title: "Natural Language Processing Specialization", provider: "DeepLearning.AI", type: "Course Series", rating: 4.9 }
    ]
  },
  "scientific publishing": {
    importance: "High",
    link: "https://www.nature.com/nature/for-authors",
    courses: [
      { title: "Navigating Scientific Publishing Journals", provider: "IEEE Education", type: "Certification", rating: 4.7 }
    ]
  },
  "mentorship": {
    importance: "Medium",
    link: "https://www.ox.ac.uk/students/academic/guidance/graduate/mentoring",
    courses: [
      { title: "Mentorship & Academic Leadership", provider: "Harvard Online", type: "Course", rating: 4.8 }
    ]
  },
  "academic administration": {
    importance: "High",
    link: "https://www.edx.org/learn/educational-leadership",
    courses: [
      { title: "Academic Administration & Policy", provider: "EdX", type: "Certification", rating: 4.7 }
    ]
  },
  "curriculum development": {
    importance: "High",
    link: "https://www.coursera.org/courses?query=curriculum-development",
    courses: [
      { title: "Curriculum Design Masterclass", provider: "EdX", type: "Course", rating: 4.6 }
    ]
  },
  "strategic leadership": {
    importance: "High",
    link: "https://www.coursera.org/learn/strategic-leadership",
    courses: [
      { title: "Strategic Leadership in Higher Education", provider: "Vanguard", type: "Executive Program", rating: 4.9 }
    ]
  },
  "node.js": {
    importance: "High",
    link: "https://nodejs.org/en/learn",
    courses: [
      { title: "Node.js Backend Bootcamp", provider: "Udemy", type: "Video Course", rating: 4.8 }
    ]
  },
  "postgresql": {
    importance: "Medium",
    link: "https://www.postgresql.org/docs/",
    courses: [
      { title: "SQL for Web Developers", provider: "Coursera", type: "Course", rating: 4.9 }
    ]
  },
  "aws": {
    importance: "Medium",
    link: "https://aws.amazon.com/training/",
    courses: [
      { title: "Cloud Computing with AWS", provider: "AWS Training", type: "Certification", rating: 4.7 }
    ]
  },
  "python": {
    importance: "High",
    link: "https://www.python.org/",
    courses: [
      { title: "Python for Everybody Specialization", provider: "University of Michigan", type: "Course Series", rating: 4.8 }
    ]
  },
  "pytorch": {
    importance: "High",
    link: "https://pytorch.org/",
    courses: [
      { title: "Deep Learning with PyTorch", provider: "DeepLearning.AI", type: "Course", rating: 4.9 }
    ]
  },
  "tensorflow": {
    importance: "High",
    link: "https://www.tensorflow.org/",
    courses: [
      { title: "TensorFlow Developer Certificate", provider: "DeepLearning.AI", type: "Course Series", rating: 4.8 }
    ]
  },
  "typescript": {
    importance: "High",
    link: "https://www.typescriptlang.org/",
    courses: [
      { title: "TypeScript for Production Applications", provider: "Frontend Masters", type: "Course", rating: 4.8 }
    ]
  },
  "framer motion": {
    importance: "Medium",
    link: "https://www.framer.com/motion/",
    courses: [
      { title: "Framer Motion Masterclass (Advanced)", provider: "DesignCo Academy", type: "Masterclass", rating: 4.9 }
    ]
  }
};

export default function SkillAnalysis({ activeJobId, userSkills }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl(`/api/jobs/${activeJobId}`))
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching job details:', err);
        setLoading(false);
      });
  }, [activeJobId]);

  if (loading) {
    return (
      <section id="skill-gap" className="bg-bg-secondary/30 py-16">
        <div className="container flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-text-secondary text-sm">Evaluating target job requirements...</p>
        </div>
      </section>
    );
  }

  if (!job) {
    return (
      <section id="skill-gap" className="bg-bg-secondary/30 py-16">
        <div className="container text-center text-text-secondary">
          Select a position to view dynamic skill-gap comparisons.
        </div>
      </section>
    );
  }

  // Perform dynamic Set evaluation
  const skillsRequired = job.skills || [];
  const normalizedUserSkills = userSkills ? userSkills.map(s => s.toLowerCase()) : [];

  // Foundational Skills (skills the user possesses that the job requires)
  const foundationalSkills = skillsRequired.filter(skill => 
    normalizedUserSkills.includes(skill.toLowerCase())
  );

  // Missing Skills (skills required by the job but missing in user's profile)
  const missingSkills = skillsRequired.filter(skill => 
    !normalizedUserSkills.includes(skill.toLowerCase())
  );

  // Dynamic Learning recommendations
  const recommendedCourses = [];
  const missingSkillsList = [];

  missingSkills.forEach(skill => {
    const key = skill.toLowerCase();
    const directoryMatch = COURSES_DIRECTORY[key];
    
    const importance = directoryMatch ? directoryMatch.importance : "Medium";
    const resourceUrl = directoryMatch ? directoryMatch.link : "https://www.google.com/search?q=learn+" + encodeURIComponent(skill);

    missingSkillsList.push({
      name: skill,
      importance,
      resource: resourceUrl
    });

    if (directoryMatch && directoryMatch.courses) {
      directoryMatch.courses.forEach(course => {
        // Prevent duplicate courses
        if (!recommendedCourses.some(c => c.title === course.title)) {
          recommendedCourses.push(course);
        }
      });
    }
  });

  // Default fallback recommendation if they have no gaps
  if (recommendedCourses.length === 0) {
    recommendedCourses.push({
      title: "Advanced System Architecture & Scale",
      provider: "Elevate Elite",
      type: "Masterclass",
      rating: 4.9
    });
  }

  return (
    <section id="skill-gap" className="bg-bg-secondary/30">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Skill lists comparison panel */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Skill Gap Analysis</h2>
            <p className="text-text-secondary mb-8">
              Target Position: <span className="text-white font-semibold">{job.title}</span>
            </p>
            
            <div className="space-y-6">
              
              {/* Foundational skills present */}
              <div className="p-6 glass border-secondary/20 bg-secondary/5 rounded-2xl">
                <div className="flex items-center gap-2 text-secondary mb-4">
                  <CheckCircle2 size={24} />
                  <h4 className="font-bold">Your Foundational Skills</h4>
                </div>
                {userSkills && userSkills.length > 0 ? (
                  foundationalSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {foundationalSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-secondary/10 border border-secondary/20 text-secondary rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-secondary font-medium">
                      No matching skills found in target requirements. Explore target skills below to develop them!
                    </p>
                  )
                ) : (
                  <p className="text-xs text-orange-400 font-medium">
                    Upload your resume in the **Resume Intelligence** section to instantly compare your skills with this role.
                  </p>
                )}
              </div>

              {/* Skills to develop */}
              <div className="p-6 glass border-accent/20 bg-accent/5 rounded-2xl">
                <div className="flex items-center gap-2 text-accent mb-4">
                  <AlertCircle size={24} />
                  <h4 className="font-bold">Skills to Develop</h4>
                </div>
                
                {userSkills && userSkills.length > 0 ? (
                  missingSkillsList.length > 0 ? (
                    <div className="space-y-4">
                      {missingSkillsList.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <span className="font-medium text-white">{skill.name}</span>
                            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${skill.importance === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                              {skill.importance} Priority
                            </span>
                          </div>
                          <a href={skill.resource} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white transition-colors">
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-secondary/10 border border-secondary/25 text-secondary text-sm rounded-xl font-bold text-center">
                      ✓ 100% Match! You have all the skills required for this position.
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    {skillsRequired.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 opacity-55">
                        <span className="font-medium text-white">{skill}</span>
                        <HelpCircle size={16} className="text-text-secondary" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Learning path recommendations panel */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Learning Recommendation</h2>
            <p className="text-text-secondary mb-8">Personalized curriculum based on your career goals.</p>
            
            <div className="grid gap-4">
              {recommendedCourses.map((course, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="p-5 bg-bg-secondary border border-border rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors"
                >
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-lg">{course.title}</h4>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <span>★</span>
                        <span>{course.rating}</span>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">
                      {course.provider} • {course.type}
                    </p>
                    <button className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all bg-transparent border-none cursor-pointer">
                      Enroll Now <TrendingUp size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
