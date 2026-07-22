import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api.js';
import { motion } from 'framer-motion';
import { 
  Award, Briefcase, FileText, CheckCircle2, BookOpen, 
  MapPin, DollarSign, Calendar, RefreshCw, Compass, ArrowRight, Sparkles, GraduationCap, ArrowLeft,
  Video, TrendingUp, ShieldCheck
} from 'lucide-react';
import SkillTest from './SkillTest';

export default function UserDashboard({ user, onBackToJobs, uploadedFileName, onUploadSuccess, onNavigateToTab }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [subView, setSubView] = useState('overview'); // overview or skill-test

  useEffect(() => {
    if (subView === 'overview') {
      fetchApplications();
    }
  }, [subView]);

  const fetchApplications = () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(apiUrl('/api/applications'), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplications(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching applications:', err);
        setIsLoading(false);
      });
  };

  const handleDashboardResumeUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    const token = localStorage.getItem('token');
    fetch(apiUrl('/api/resume/upload'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setIsUploading(false);
        if (data.skills) {
          onUploadSuccess(data.resumeName, data.skills);
        }
      })
      .catch(err => {
        console.error('Error uploading from dashboard:', err);
        setIsUploading(false);
      });
  };

  // Dynamically compute a readiness score based on resume status, skills, and applications
  const computeReadinessScore = () => {
    let score = 30; // base score for registration
    if (uploadedFileName) score += 30; // +30% for CV
    if (user.skills && user.skills.length > 0) {
      score += Math.min(20, user.skills.length * 4); // +4% per skill, up to 20%
    }
    if (applications.length > 0) {
      score += Math.min(10, applications.length * 5); // +5% per application, up to 10%
    }
    if (localStorage.getItem('interviewCompleted') === 'true') {
      score += 10; // +10% for video interview
    }
    if (localStorage.getItem('blockchainMinted') === 'true') {
      score += 10; // +10% for blockchain credentials
    }
    return score;
  };

  const readinessScore = computeReadinessScore();

  // If taking a skill test, render the SkillTest component cleanly
  if (subView === 'skill-test') {
    return (
      <div className="container py-12">
        <button 
          onClick={() => setSubView('overview')}
          className="btn btn-secondary py-2 px-4 mb-6 text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <SkillTest 
          user={user} 
          onNavigateToJobs={onBackToJobs}
          onSkillAdded={(newSkills) => onUploadSuccess(uploadedFileName, newSkills)}
        />
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Award size={14} /> HireHub Candidate command center
          </span>
          <h2 className="text-4xl font-bold mb-1">Welcome back, {user.name}!</h2>
          <p className="text-text-secondary">Track your application dossier, resume intelligence parsing, and verified credentials.</p>
        </div>
        <button 
          onClick={onBackToJobs}
          className="btn btn-secondary flex items-center gap-2 hover:gap-3 transition-all"
        >
          Browse Open Positions <ArrowRight size={16} />
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Side: Profile & Readiness Score */}
        <div className="md:col-span-1 space-y-6">
          {/* Readiness Circle Widget */}
          <div className="card text-center p-8 relative overflow-hidden border border-white/5">
            <h3 className="font-bold text-lg mb-6">HireHub readiness Score</h3>
            
            <div className="relative inline-flex items-center justify-center mb-6">
              {/* Circular Gauge */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle 
                  cx="72" cy="72" r="64" 
                  className="stroke-white/5 fill-none" 
                  strokeWidth="8"
                />
                <circle 
                  cx="72" cy="72" r="64" 
                  className="stroke-primary fill-none transition-all duration-1000" 
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 64}
                  strokeDashoffset={2 * Math.PI * 64 * (1 - readinessScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-3xl font-extrabold text-white">
                {readinessScore}%
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-4">
              {readinessScore < 50 
                ? "Upload a PDF resume in the Command Center to parse your skills and instantly increase your matching score."
                : readinessScore < 85 
                ? "Excellent progress! Take interactive quizzes below to earn verified credentials and enhance your matching score."
                : "Outstanding readiness! Your profile is highly competitive for elite listings."}
            </p>
          </div>

          {/* Interactive Feature Entry Cards */}
          <div className="card p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2 text-white">
              <GraduationCap size={20} className="text-primary animate-pulse" /> Skill Credentials
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Verify your Python, React, or ML skills by completing small quizzes. Earn verified badges shown on your matches!
            </p>
            <button 
              onClick={() => setSubView('skill-test')}
              className="btn btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-1"
            >
              Take Skill Test <ArrowRight size={14} />
            </button>
          </div>

          <div className="card p-6 bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2 text-white">
              <Sparkles size={20} className="text-accent" /> AI Career Guidance
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Stuck on interview prep? Talk with our customized AI Chatbot to receive job matches and practice questionnaires.
            </p>
            <button 
              onClick={() => onNavigateToTab('chatbot')}
              className="btn btn-secondary w-full py-2.5 text-xs text-accent hover:text-white flex items-center justify-center gap-1"
            >
              Open AI Career Chat <Sparkles size={14} />
            </button>
          </div>

          <div className="card p-6 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2 text-white">
              <Video size={20} className="text-red-400" /> Video Interview Prep
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Unlock video resume scoring and custom tech diagnostics by practicing path-based interactive mock interviews.
            </p>
            <button 
              onClick={() => onNavigateToTab('interview')}
              className="btn btn-secondary w-full py-2.5 text-xs text-red-400 hover:text-white flex items-center justify-center gap-1"
            >
              Start Video Interview <Video size={14} />
            </button>
          </div>

          <div className="card p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2 text-white">
              <TrendingUp size={20} className="text-green-400" /> Salary Predictor
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Calculate expected salaries, track hiring hot spots, and evaluate technical skill premiums recursively.
            </p>
            <button 
              onClick={() => onNavigateToTab('predictor')}
              className="btn btn-secondary w-full py-2.5 text-xs text-green-400 hover:text-white flex items-center justify-center gap-1"
            >
              Open Salary Forecast <TrendingUp size={14} />
            </button>
          </div>

          <div className="card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2 text-white">
              <ShieldCheck size={20} className="text-indigo-400 animate-pulse" /> Blockchain Ledger
            </h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Mint your credentials onto a cryptographically secure ledger to lock in your parsed resume qualifications decetralized.
            </p>
            <button 
              onClick={() => onNavigateToTab('blockchain')}
              className="btn btn-secondary w-full py-2.5 text-xs text-indigo-400 hover:text-white flex items-center justify-center gap-1"
            >
              Verify on Blockchain <ShieldCheck size={14} />
            </button>
          </div>

        </div>

        {/* Right Side: Resume, Skills & Application Timeline */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Resume Control Widget */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Resume Analyzer
              </h3>
              
              {uploadedFileName ? (
                <div className="space-y-4">
                  <div className="p-3 bg-secondary/5 border border-secondary/15 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs text-text-secondary font-medium">Active File</div>
                      <div className="text-sm font-semibold text-white truncate">{uploadedFileName}</div>
                    </div>
                  </div>

                  <div className="text-xs text-text-secondary">
                    Uploaded resume parsed successfully. <strong>{user.skills ? user.skills.length : 0} skills</strong> synced with HireHub.
                  </div>

                  <label className="btn btn-secondary w-full py-2.5 text-xs cursor-pointer flex items-center justify-center gap-2">
                    <RefreshCw size={14} className={isUploading ? 'animate-spin' : ''} />
                    {isUploading ? "Uploading..." : "Replace Resume (PDF)"}
                    <input 
                      type="file" 
                      onChange={handleDashboardResumeUpload} 
                      accept=".pdf" 
                      className="hidden" 
                      disabled={isUploading}
                    />
                  </label>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-text-secondary mb-6">No resume file uploaded yet.</p>
                  <label className="btn btn-primary w-full py-2.5 text-xs cursor-pointer flex items-center justify-center gap-2">
                    <FileText size={14} className={isUploading ? 'animate-spin' : ''} />
                    {isUploading ? "Uploading..." : "Upload Resume (PDF)"}
                    <input 
                      type="file" 
                      onChange={handleDashboardResumeUpload} 
                      accept=".pdf" 
                      className="hidden" 
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* User Skills Widget */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-secondary" /> Registered Skills
              </h3>
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[140px] pr-1">
                  {user.skills.map((skill, si) => (
                    <span 
                      key={si} 
                      className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">
                  Upload a CV file or pass credential tests to automatically list your technical skills here.
                </p>
              )}
            </div>

          </div>

          {/* Application History Timeline */}
          <div className="card p-8 border border-white/5">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase size={22} className="text-primary" /> Application Dossier Status
              </h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-extrabold rounded-full">
                {applications.length} Applied
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-text-secondary text-sm">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-white/5 rounded-full inline-flex text-text-secondary mb-4">
                  <Compass size={32} />
                </div>
                <h4 className="text-lg font-bold mb-1">Your dossier is empty!</h4>
                <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
                  You haven't submitted any applications yet. Browse the available open positions, click to see gap analysis, and submit your first application.
                </p>
                <button 
                  onClick={onBackToJobs}
                  className="btn btn-primary px-6 py-2.5 text-sm"
                >
                  Find Openings Now
                </button>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                {applications.map((app, index) => {
                  let statusBg = "bg-primary/10 text-primary border-primary/20";
                  if (app.status === 'Under Review') statusBg = "bg-accent/10 text-accent border-accent/20";
                  if (app.status === 'Interview Scheduled') statusBg = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                  if (app.status === 'Offered') statusBg = "bg-secondary/10 text-secondary border-secondary/20";

                  return (
                    <motion.div 
                      key={app.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 relative"
                    >
                      {/* Timeline Dot Indicator */}
                      <div className="w-12 h-12 rounded-full bg-bg-secondary border border-white/10 flex items-center justify-center text-primary font-bold z-10 shrink-0 shadow-lg">
                        {index + 1}
                      </div>

                      <div className="flex-1 p-5 glass border border-white/5 bg-white/5 rounded-2xl hover:border-primary/30 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <h4 className="font-bold text-lg text-white">{app.jobTitle}</h4>
                            <p className="text-sm font-semibold text-text-secondary">{app.jobCompany}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${statusBg}`}>
                            {app.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-text-secondary border-t border-white/5 pt-3">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{app.jobLocation}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            <span>{app.jobSalary}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Applied: {new Date(app.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                          </div>
                        </div>

                        {app.resumeName && (
                          <div className="mt-3 p-2 bg-black/25 rounded-lg text-xs text-secondary font-medium inline-flex items-center gap-1.5">
                            <FileText size={12} />
                            <span>Attached CV: {app.resumeName}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
