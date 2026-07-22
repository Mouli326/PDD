import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Zap, ArrowUpRight, X, FileText, Check, Loader2, Award, AlertCircle } from 'lucide-react';

export default function JobList({ uploadedFileName, activeJobId, setActiveJobId, user }) {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [filter, setFilter] = useState('all'); // all, academia, industry
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = () => {
    setJobsLoading(true);
    fetch(apiUrl(`/api/jobs?category=${filter}`))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
        }
        setJobsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching jobs:', err);
        setJobsLoading(false);
      });
  };

  const handleApplyClick = (job, e) => {
    e.stopPropagation(); // Prevent card click triggers
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please Sign In first to apply for positions.");
      return;
    }

    setSelectedJob(job);
    setIsSubmitting(false);
    setIsSuccess(false);
    setErrorMsg('');
    setName(user ? user.name : '');
    setEmail(user ? user.email : '');
    setStatementOfPurpose('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Session expired. Please login again.');
      setIsSubmitting(false);
      return;
    }

    fetch(apiUrl('/api/applications'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        jobId: selectedJob.id,
        name,
        email,
        statementOfPurpose
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Application failed to submit.');
        }
        return data;
      })
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      })
      .catch(err => {
        setIsSubmitting(false);
        setErrorMsg(err.message || 'Error submitting application dossier.');
      });
  };

  // Dynamically compute the match score based on parsed user skills
  const computeMatchScore = (jobSkills) => {
    if (!user || !user.skills || user.skills.length === 0) {
      return null;
    }
    const matched = jobSkills.filter(skill => 
      user.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
    return Math.round((matched.length / jobSkills.length) * 100);
  };

  return (
    <section id="job-list">
      <div className="container">
        <div style={{marginBottom:'2rem'}}>
          <h2 style={{fontSize:'clamp(1.5rem, 4vw, 2rem)', fontWeight:800, marginBottom:'0.5rem'}}>Available Positions &amp; Openings</h2>
          <p style={{color:'var(--text-secondary)', fontSize:'0.9rem', maxWidth:'520px'}}>Explore high-potential roles. Click any position to view its personalized AI Skill Gap Analysis.</p>
        </div>

        {/* Filter Categories */}
        <div style={{display:'flex', flexWrap:'wrap', gap:'0.625rem', marginBottom:'2.5rem'}}>
          {[
            { key: 'all', label: 'All Positions' },
            { key: 'academia', label: 'Academia & Research' },
            { key: 'industry', label: 'Industry & Tech' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              style={{
                padding:'0.5rem 1.25rem',
                borderRadius:'9999px',
                fontWeight:700,
                fontSize:'0.82rem',
                cursor:'pointer',
                border: filter === cat.key ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.12)',
                transition:'all 0.2s',
                whiteSpace:'nowrap',
                background: filter === cat.key ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                color: filter === cat.key ? 'white' : 'var(--text-secondary)',
                boxShadow: filter === cat.key ? '0 4px 14px rgba(168,85,247,0.3)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        {jobsLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-text-secondary text-sm">Loading current job openings...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job, index) => {
              const isActive = job.id === activeJobId;
              const matchScore = computeMatchScore(job.skills);

              return (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`card group cursor-pointer transition-all ${
                    isActive 
                      ? 'border-primary/50 shadow-lg shadow-primary/5 bg-primary/5' 
                      : ''
                  }`}
                  onClick={() => {
                    setActiveJobId(job.id);
                    const skillGapSection = document.getElementById('skill-gap');
                    if (skillGapSection) {
                      skillGapSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}>{job.title}</h3>
                        
                        {matchScore !== null ? (
                          <div className={`px-2 py-1 text-xs font-bold rounded flex items-center gap-1 ${matchScore >= 70 ? 'bg-secondary/10 text-secondary' : matchScore >= 40 ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-400'}`}>
                            <Zap size={12} fill="currentColor" />
                            {matchScore}% Match
                          </div>
                        ) : (
                          <div className="px-2 py-1 bg-white/5 text-text-secondary text-xs font-semibold rounded flex items-center gap-1">
                            Pending CV Upload
                          </div>
                        )}

                        {isActive && (
                          <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Active Analysis Target
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium mb-4">{job.company}</div>
                    
                      <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-6">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, si) => (
                          <span key={si} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        className="btn btn-primary"
                        onClick={(e) => handleApplyClick(job, e)}
                      >
                        Apply Now
                      </button>
                      <button className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                        <Zap size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Premium Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedJob(null)}
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass p-8 border border-white/10 shadow-2xl z-10 overflow-hidden"
            >
              {/* Top Close Button */}
              <button 
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-white"
                onClick={() => setSelectedJob(null)}
              >
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {!isSubmitting && !isSuccess && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Award size={20} />
                      <span className="text-xs font-semibold uppercase tracking-wider">{selectedJob.category === 'academia' ? 'Academic Application' : 'Developer Application'}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1 text-white">{selectedJob.title}</h3>
                    <p className="text-sm text-text-secondary mb-6">{selectedJob.company}</p>

                    {errorMsg && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs text-red-400">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <label className="label">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Dr. Alexander Vance"
                          className="input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="label">Institutional Email</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="vance@university.edu"
                          className="input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="label">Statement of Purpose / Research Cover Letter</label>
                        <textarea 
                          required 
                          placeholder="Briefly state your research interest, teaching philosophy, or professional development experience..."
                          className="textarea"
                          value={statementOfPurpose}
                          onChange={(e) => setStatementOfPurpose(e.target.value)}
                        />
                      </div>

                      {/* Integrated Resume Badge */}
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                        <span className="label" style={{ marginBottom: '0.25rem' }}>Curriculum Vitae (CV)</span>
                        {uploadedFileName ? (
                          <div className="flex items-center gap-2 text-secondary text-sm font-semibold mt-1">
                            <FileText size={18} />
                            <span>Attached: {uploadedFileName}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-orange-400 mt-1">
                            No CV uploaded yet. You can still apply, but uploading a CV in the <strong>Resume Intelligence</strong> section will automatically attach it here.
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => setSelectedJob(null)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Submit Application
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {isSubmitting && (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center flex flex-col items-center justify-center"
                  >
                    <Loader2 size={54} className="text-primary animate-spin mb-4" />
                    <h4 className="text-xl font-bold mb-2">Submitting to Selection Committee</h4>
                    <p className="text-text-secondary text-sm max-w-sm">
                      Encrypting academic records and transferring your application dossier to the review board...
                    </p>
                  </motion.div>
                )}

                {isSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-6 text-center flex flex-col items-center justify-center"
                  >
                    <div className="p-4 bg-secondary/15 rounded-full text-secondary mb-4 shadow-lg border border-secondary/20">
                      <Check size={40} />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Application Submitted!</h4>
                    <p className="text-text-secondary text-sm max-w-md mb-6" style={{ lineHeight: '1.6' }}>
                      Dear <strong className="text-white">{name}</strong>, your application dossier for the position of <strong>{selectedJob.title}</strong> has been successfully registered with the search committee at <strong className="text-white">{selectedJob.company}</strong>.
                    </p>
                    
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-left w-full text-xs space-y-2 mb-6">
                      <div><span className="text-text-secondary">Applicant:</span> <span className="text-white font-medium">{name}</span></div>
                      <div><span className="text-text-secondary">Dossier Email:</span> <span className="text-white font-medium">{email}</span></div>
                      {uploadedFileName && <div><span className="text-text-secondary">Attached CV:</span> <span className="text-secondary font-medium">{uploadedFileName}</span></div>}
                      <div><span className="text-text-secondary">Status:</span> <span className="text-primary font-medium">Under Review by Selection Board</span></div>
                    </div>

                    <button 
                      className="btn btn-secondary w-full"
                      onClick={() => setSelectedJob(null)}
                    >
                      Close Portal
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
