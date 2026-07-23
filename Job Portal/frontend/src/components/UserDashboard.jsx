import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Briefcase, FileText, CheckCircle2, BookOpen, 
  MapPin, IndianRupee, Calendar, RefreshCw, Compass, ArrowRight, Sparkles, GraduationCap, ArrowLeft,
  TrendingUp, ShieldCheck, User, Mail, Zap, BarChart2, Clock, ExternalLink
} from 'lucide-react';
import SkillTest from './SkillTest';

export default function UserDashboard({ user, onBackToJobs, uploadedFileName, onUploadSuccess, onNavigateToTab }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [subView, setSubView] = useState('overview');

  useEffect(() => {
    if (subView === 'overview') fetchApplications();
  }, [subView]);

  const fetchApplications = () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(apiUrl('/api/applications'), {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setApplications(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
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
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setIsUploading(false);
        if (data.skills) onUploadSuccess(data.resumeName, data.skills);
      })
      .catch(() => setIsUploading(false));
  };

  // Skill test sub-view
  if (subView === 'skill-test') {
    return (
      <div className="container py-12">
        <button
          onClick={() => setSubView('overview')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', marginBottom: '1.5rem' }}
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

  // Quick stats
  const skillCount = user?.skills?.length || 0;
  const appliedCount = applications.length;
  const blockchainMinted = localStorage.getItem('blockchainMinted') === 'true';

  const quickStats = [
    { label: 'Skills Verified', value: skillCount, icon: CheckCircle2, color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
    { label: 'Applications', value: appliedCount, icon: Briefcase, color: '#a78bfa', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
    { label: 'Resume Active', value: uploadedFileName ? '✓' : '—', icon: FileText, color: uploadedFileName ? '#4ade80' : '#94a3b8', bg: uploadedFileName ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: uploadedFileName ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)' },
  ];

  const featureCards = [
    {
      title: 'Skill Credential Tests',
      desc: 'Earn verified skill badges by passing quick 3-question assessments. Badges boost your match % across job listings.',
      icon: GraduationCap,
      color: '#c084fc',
      bg: 'rgba(168,85,247,0.08)',
      border: 'rgba(168,85,247,0.2)',
      btnBg: 'var(--primary)',
      btnColor: 'white',
      btnBorder: 'none',
      action: () => setSubView('skill-test'),
      btnLabel: 'Start Skill Test',
    },
    {
      title: 'AI Career Chat',
      desc: 'Talk to our context-aware AI assistant for mock interview prep, career advice, and job-specific guidance.',
      icon: Sparkles,
      color: '#f472b6',
      bg: 'rgba(236,72,153,0.08)',
      border: 'rgba(236,72,153,0.2)',
      btnBg: 'rgba(236,72,153,0.15)',
      btnColor: '#f472b6',
      btnBorder: '1px solid rgba(236,72,153,0.3)',
      action: () => onNavigateToTab('chatbot'),
      btnLabel: 'Open Career AI',
    },
    {
      title: 'Salary Predictor (₹)',
      desc: 'Forecast your salary range in Indian Rupees based on role, location, experience, and tech stack competencies.',
      icon: TrendingUp,
      color: '#4ade80',
      bg: 'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.2)',
      btnBg: 'rgba(34,197,94,0.15)',
      btnColor: '#4ade80',
      btnBorder: '1px solid rgba(34,197,94,0.3)',
      action: () => onNavigateToTab('predictor'),
      btnLabel: 'Open Salary Forecast',
    },
  ];

  return (
    <div className="container py-10">

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Award size={13} /> Candidate Command Center
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.2 }}>
            Welcome back, <span style={{ color: 'var(--primary)' }}>{user.name}</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Track applications, manage credentials, and explore career tools.
          </p>
        </div>
        <button
          onClick={onBackToJobs}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.75rem 1.5rem', borderRadius: '0.625rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
        >
          Browse Positions <ArrowRight size={15} />
        </button>
      </div>

      {/* ── Quick Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {quickStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}
            >
              <div style={{ padding: '0.625rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.625rem', color: s.color, display: 'flex' }}>
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid md:grid-cols-3 gap-8">

        {/* ── Left Column: Profile + Feature Cards ── */}
        <div className="md:col-span-1 space-y-5">

          {/* Profile Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(168,85,247,0.2)', border: '2px solid rgba(168,85,247,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', flexShrink: 0 }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: 'white', margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{user.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Active Resume', value: uploadedFileName || 'No resume uploaded', icon: FileText, ok: !!uploadedFileName },
                { label: 'Verified Skills', value: `${skillCount} skill${skillCount !== 1 ? 's' : ''} synced`, icon: CheckCircle2, ok: skillCount > 0 },
                { label: 'Applications Sent', value: `${appliedCount} submitted`, icon: Briefcase, ok: appliedCount > 0 },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Icon size={15} style={{ color: item.ok ? '#4ade80' : 'var(--text-secondary)', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>{item.label}</p>
                      <p style={{ fontSize: '0.8rem', color: 'white', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Upload Resume Button */}
            <div style={{ marginTop: '1rem' }}>
              {uploadedFileName ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <label style={{ flex: 1, padding: '0.625rem 0.75rem', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <RefreshCw size={12} className={isUploading ? 'animate-spin' : ''} />
                    {isUploading ? 'Uploading...' : 'Replace PDF'}
                    <input type="file" onChange={handleDashboardResumeUpload} accept=".pdf" className="hidden" disabled={isUploading} />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) fetch(apiUrl('/api/resume/delete'), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
                      onUploadSuccess('', []);
                    }}
                    style={{ padding: '0.625rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                  <FileText size={14} className={isUploading ? 'animate-spin' : ''} />
                  {isUploading ? 'Uploading...' : 'Upload Resume PDF'}
                  <input type="file" onChange={handleDashboardResumeUpload} accept=".pdf" className="hidden" disabled={isUploading} />
                </label>
              )}
            </div>
          </div>

          {/* Skill Tags */}
          {user.skills && user.skills.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Registered Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
                {user.skills.map((skill, si) => (
                  <span key={si} style={{ padding: '3px 10px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, color: '#c084fc' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feature Cards */}
          {featureCards.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: '1.25rem', padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
                  <div style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', color: f.color, display: 'flex' }}>
                    <Icon size={18} />
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', margin: 0 }}>{f.title}</h4>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', lineHeight: 1.5 }}>{f.desc}</p>
                <button
                  onClick={f.action}
                  style={{ width: '100%', padding: '0.625rem', background: f.btnBg, color: f.btnColor, border: f.btnBorder, borderRadius: '0.5rem', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition: 'all 0.2s' }}
                >
                  {f.btnLabel} <ArrowRight size={13} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* ── Right Column: Applications ── */}
        <div className="md:col-span-2 space-y-6">

          {/* Application Timeline */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontWeight: 900, fontSize: '1.2rem', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} style={{ color: 'var(--primary)' }} /> Application Dossier
              </h3>
              <span style={{ padding: '3px 12px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                {applications.length} Submitted
              </span>
            </div>

            {isLoading ? (
              <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid rgba(168,85,247,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  <Compass size={36} />
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', margin: '0 0 0.5rem' }}>No Applications Yet</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Browse open positions and submit your first application to begin tracking your dossier status here.
                </p>
                <button
                  onClick={onBackToJobs}
                  style={{ padding: '0.75rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(168,85,247,0.35)' }}
                >
                  Find Openings Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.map((app, index) => {
                  const statusConfig = {
                    'Applied':              { color: '#a78bfa', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
                    'Under Review':         { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
                    'Interview Scheduled':  { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.2)' },
                    'Offered':              { color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
                  };
                  const sc = statusConfig[app.status] || statusConfig['Applied'];

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem', transition: 'border-color 0.2s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'white', margin: '0 0 4px' }}>{app.jobTitle}</h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>{app.jobCompany}</p>
                        </div>
                        <span style={{ padding: '4px 12px', background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, color: sc.color, flexShrink: 0 }}>
                          {app.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} /> {app.jobLocation}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IndianRupee size={13} /> {app.jobSalary}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> Applied: {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {app.resumeName && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4ade80' }}>
                            <FileText size={13} /> {app.resumeName}
                          </span>
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
