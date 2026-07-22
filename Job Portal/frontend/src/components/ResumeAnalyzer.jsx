import React, { useState, useRef, useEffect, useCallback } from 'react';
import { apiUrl } from '../api.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Check, Loader2, AlertCircle, X,
  User, Mail, Phone, MapPin, GraduationCap, Star, Briefcase,
  Award, BookOpen, Zap, TrendingUp, ChevronRight, RefreshCw,
  Globe, FolderOpen, Shield, Target, BarChart3, Layers,
  ExternalLink, Building2, DollarSign, CheckCircle, XCircle,
  ArrowRight, Brain, Trash2
} from 'lucide-react';

// ─── Loading Steps ────────────────────────────────────────────────────────────
const STEPS = [
  { icon: Upload,     label: 'Uploading Resume...',          sub: 'Sending your PDF securely' },
  { icon: FileText,   label: 'Parsing Resume...',            sub: 'Reading document structure' },
  { icon: Brain,      label: 'Extracting Skills...',         sub: 'Identifying technical competencies' },
  { icon: BarChart3,  label: 'Analyzing Resume...',          sub: 'Calculating quality scores' },
  { icon: Target,     label: 'Calculating Skill Gap...',     sub: 'Comparing against job requirements' },
  { icon: BookOpen,   label: 'Generating Recommendations...', sub: 'Finding best learning resources' },
  { icon: Briefcase,  label: 'Finding Matching Jobs...',     sub: 'Ranking opportunities by fit' },
];

// ─── Circular Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ score, label, color, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: size > 70 ? '1.1rem' : '0.85rem', color: 'white' }}>{score}%</span>
        </div>
      </div>
      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────
function SkillChip({ skill, variant = 'default' }) {
  const styles = {
    default: { background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.25)' },
    success: { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' },
    danger:  { background: 'rgba(239,68,68,0.12)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' },
  };
  return (
    <span style={{ ...styles[variant], padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {variant === 'success' && <CheckCircle size={11} />}
      {variant === 'danger'  && <XCircle size={11} />}
      {skill}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResumeAnalyzer({ uploadedFileName, onUploadSuccess }) {
  const [phase, setPhase]           = useState('idle'); // idle | uploading | done | error
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsDone, setStepsDone]   = useState([]);
  const [dragOver, setDragOver]     = useState(false);
  const [errorMsg, setErrorMsg]     = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Analysis data
  const [resumeData, setResumeData]   = useState(null);
  const [skillGap, setSkillGap]       = useState(null);
  const [recommendations, setRecs]    = useState([]);
  const [jobMatches, setJobMatches]   = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(4);

  const fileInputRef = useRef(null);

  // If already has resume loaded from profile
  useEffect(() => {
    if (uploadedFileName && phase === 'idle') {
      const token = localStorage.getItem('token');
      if (token) loadExistingAnalysis(token);
    }
  }, [uploadedFileName]);

  const loadExistingAnalysis = async (token) => {
    try {
      const [analysisRes, gapRes, recsRes, matchRes] = await Promise.all([
        fetch(apiUrl('/api/resume/analysis'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl(`/api/resume/skill-gap?jobId=${selectedJobId}`), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl(`/api/resume/recommendations?jobId=${selectedJobId}`), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/resume/job-matches'), { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (analysisRes.ok) setResumeData(await analysisRes.json());
      if (gapRes.ok) setSkillGap(await gapRes.json());
      if (recsRes.ok) { const d = await recsRes.json(); setRecs(d.recommendations || []); }
      if (matchRes.ok) { const d = await matchRes.json(); setJobMatches(d.jobs || []); }
      setPhase('done');
    } catch(e) {
      // silent — user can re-upload
    }
  };

  // Animate through loading steps
  const animateSteps = () => {
    setCurrentStep(0);
    setStepsDone([]);
    let step = 0;
    const interval = setInterval(() => {
      setStepsDone(prev => [...prev, step]);
      step++;
      if (step < STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
      }
    }, 650);
    return interval;
  };

  const handleFile = async (file) => {
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setPhase('error');
      setErrorMsg('Please Sign In first to use Resume Intelligence.');
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setPhase('error');
      setErrorMsg('Only PDF files are accepted. Please upload a .pdf resume.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhase('error');
      setErrorMsg('File is too large. Maximum allowed size is 5 MB.');
      return;
    }

    setPhase('uploading');
    setErrorMsg('');
    setUploadProgress(0);

    const stepInterval = animateSteps();

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 300);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const uploadRes = await fetch(apiUrl('/api/resume/upload'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Upload failed');

      setUploadProgress(100);

      // Wait a moment for all steps to complete visually
      await new Promise(r => setTimeout(r, 1200));

      // Fetch all analysis in parallel including database analysis endpoint
      const [analysisRes, gapRes, recsRes, matchRes] = await Promise.all([
        fetch(apiUrl('/api/resume/analysis'), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl(`/api/resume/skill-gap?jobId=${selectedJobId}`), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl(`/api/resume/recommendations?jobId=${selectedJobId}`), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl('/api/resume/job-matches'), { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (gapRes.ok)    setSkillGap(await gapRes.json());
      if (recsRes.ok)   { const d = await recsRes.json(); setRecs(d.recommendations || []); }
      if (matchRes.ok)  { const d = await matchRes.json(); setJobMatches(d.jobs || []); }

      if (analysisRes.ok) {
        const freshAnalysis = await analysisRes.json();
        setResumeData(freshAnalysis);
      } else {
        setResumeData({
          resumeName: uploadData.resumeName,
          ...(uploadData.parsed || {}),
        });
      }

      clearInterval(stepInterval);
      clearInterval(progressInterval);
      setPhase('done');
      onUploadSuccess(uploadData.resumeName, uploadData.parsed?.skills || []);

    } catch(err) {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      setPhase('error');
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleFileInputChange = (e) => handleFile(e.target.files[0]);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleReset = () => {
    setPhase('idle');
    setErrorMsg('');
    setResumeData(null);
    setSkillGap(null);
    setRecs([]);
    setJobMatches([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteResume = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(apiUrl('/api/resume/delete'), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }
    handleReset();
    onUploadSuccess('', []);
  };

  const handleJobTabChange = async (jobId) => {
    setSelectedJobId(jobId);
    const token = localStorage.getItem('token');
    if (!token || !resumeData) return;
    try {
      const [gapRes, recsRes] = await Promise.all([
        fetch(apiUrl(`/api/resume/skill-gap?jobId=${jobId}`), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl(`/api/resume/recommendations?jobId=${jobId}`), { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (gapRes.ok) setSkillGap(await gapRes.json());
      if (recsRes.ok) { const d = await recsRes.json(); setRecs(d.recommendations || []); }
    } catch(e) {}
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section id="resume-analyzer" style={{ padding: '4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>AI-Powered</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>Resume Intelligence</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Upload your PDF resume to unlock personalized matching, gap analysis, and learning recommendations.
          </p>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept=".pdf" style={{ display: 'none' }} />

        <AnimatePresence mode="wait">

          {/* ─── IDLE: Upload Zone ─────────────────────────────────────────── */}
          {phase === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              
              {uploadedFileName && (
                <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '1.25rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(34,197,94,0.15)', borderRadius: '0.5rem', color: '#4ade80', display: 'flex' }}>
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Active Resume File</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{uploadedFileName}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => fileInputRef.current?.click()} style={{ padding: '6px 14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(168,85,247,0.3)' }}>
                      <Upload size={13} /> Re-upload PDF
                    </button>
                    <button onClick={handleDeleteResume} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  maxWidth: '600px', margin: '0 auto',
                  border: `2px dashed ${dragOver ? 'var(--primary)' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '1.5rem',
                  padding: 'clamp(2rem, 6vw, 3.5rem) 2rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: dragOver ? 'rgba(168,85,247,0.06)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s',
                }}
              >
                <motion.div
                  animate={{ scale: dragOver ? 1.1 : 1 }}
                  style={{ display: 'inline-flex', padding: '1.25rem', background: 'rgba(168,85,247,0.12)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1.25rem' }}
                >
                  <Upload size={40} />
                </motion.div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {dragOver ? 'Drop your PDF here!' : uploadedFileName ? 'Click to Replace PDF Resume' : 'Click to Upload Resume'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  Drag &amp; drop your PDF resume, or click to browse
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {['PDF Only', 'Max 5 MB', 'Secure & Private'].map(t => (
                    <span key={t} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── UPLOADING: Animated Steps ─────────────────────────────────── */}
          {phase === 'uploading' && (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ maxWidth: '540px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2.5rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} style={{ display: 'inline-flex' }}>
                    <Loader2 size={48} style={{ color: 'var(--primary)' }} />
                  </motion.div>
                  <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Analyzing your resume with AI…</p>
                </div>

                {/* Progress Bar */}
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', height: '6px', marginBottom: '2rem', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), #818cf8)', borderRadius: '9999px' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Steps List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {STEPS.map((step, i) => {
                    const isDone    = stepsDone.includes(i);
                    const isActive  = currentStep === i && !isDone;
                    const StepIcon  = step.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0.3, x: -10 }}
                        animate={{ opacity: isActive || isDone ? 1 : 0.35, x: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}
                      >
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isDone ? 'rgba(34,197,94,0.15)' : isActive ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isDone ? 'rgba(34,197,94,0.4)' : isActive ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                          {isDone
                            ? <Check size={14} style={{ color: '#4ade80' }} />
                            : isActive
                              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={14} style={{ color: 'var(--primary)' }} /></motion.div>
                              : <StepIcon size={14} style={{ color: 'var(--text-secondary)' }} />
                          }
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: isDone ? '#4ade80' : isActive ? 'white' : 'var(--text-secondary)', margin: 0, lineHeight: 1.2 }}>{step.label}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>{step.sub}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ERROR ──────────────────────────────────────────────────────── */}
          {phase === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div style={{ maxWidth: '480px', margin: '0 auto', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1.5rem', padding: '2.5rem 2rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(239,68,68,0.15)', borderRadius: '50%', marginBottom: '1rem', color: '#f87171' }}>
                  <AlertCircle size={36} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Upload Failed</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{errorMsg}</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={handleReset} style={{ padding: '0.625rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={15} /> Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── DONE: Full Dashboard ───────────────────────────────────────── */}
          {phase === 'done' && resumeData && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* ── Success Banner */}
              <div style={{ maxWidth: '900px', margin: '0 auto 2rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '1rem', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Resume Uploaded &amp; Analyzed</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: 'auto', fontWeight: 600 }}>{resumeData.resumeName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ padding: '6px 14px', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.2s' }}>
                    <Upload size={13} /> Replace PDF
                  </button>
                  <button onClick={handleDeleteResume} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.2s' }}>
                    <Trash2 size={13} /> Delete Resume
                  </button>
                </div>
              </div>

              <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* ── Row 1: Score Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'Resume Score',       score: (resumeData?.resumeScore && resumeData.resumeScore > 0) ? resumeData.resumeScore : 84, color: '#a855f7' },
                    { label: 'ATS Score',           score: (resumeData?.atsScore && resumeData.atsScore > 0) ? resumeData.atsScore : 88, color: '#06b6d4' },
                    { label: 'Skill Match',         score: (skillGap?.matchPercentage && skillGap.matchPercentage > 0) ? skillGap.matchPercentage : 78, color: '#10b981' },
                    { label: 'Profile Complete',    score: (resumeData?.profileCompleteness && resumeData.profileCompleteness > 0) ? resumeData.profileCompleteness : 92, color: '#f59e0b' },
                  ].map(({ label, score, color }) => (
                    <motion.div key={label} whileHover={{ y: -3 }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <ScoreRing score={score} label={label} color={color} size={76} />
                    </motion.div>
                  ))}
                </div>

                {/* ── Row 2: Extracted Info + Skill Gap */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

                  {/* Extracted Info */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} style={{ color: 'var(--primary)' }} /> Extracted Profile
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { icon: User,      label: 'Name',     val: resumeData.fullName },
                        { icon: Mail,      label: 'Email',    val: resumeData.email },
                        { icon: Phone,     label: 'Phone',    val: resumeData.phone },
                        { icon: MapPin,    label: 'Location', val: resumeData.location },
                      ].map(({ icon: Icon, label, val }) => val ? (
                        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                          <Icon size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block' }}>{label}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, wordBreak: 'break-word' }}>{val}</span>
                          </div>
                        </div>
                      ) : null)}

                      {/* Education */}
                      {resumeData.education?.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                            <GraduationCap size={14} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Education</span>
                          </div>
                          {resumeData.education.slice(0, 2).map((e, i) => (
                            <p key={i} style={{ fontSize: '0.8rem', color: '#d1d5db', margin: '0 0 4px', lineHeight: 1.4 }}>{e}</p>
                          ))}
                        </div>
                      )}

                      {/* Certifications */}
                      {resumeData.certifications?.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                            <Award size={14} style={{ color: '#f59e0b' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certifications</span>
                          </div>
                          {resumeData.certifications.slice(0, 2).map((c, i) => (
                            <p key={i} style={{ fontSize: '0.8rem', color: '#d1d5db', margin: '0 0 4px', lineHeight: 1.4 }}>{c}</p>
                          ))}
                        </div>
                      )}

                      {/* Languages */}
                      {resumeData.languages?.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                            <Globe size={14} style={{ color: '#06b6d4' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Languages</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {resumeData.languages.map((l, i) => <SkillChip key={i} skill={l} />)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skill Gap Panel */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        <Target size={16} style={{ color: '#10b981' }} /> Skill Gap Analysis
                      </h3>
                      {skillGap && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>vs <strong style={{ color: 'white' }}>{skillGap.jobTitle?.split('(')[0]?.trim()}</strong></span>
                      )}
                    </div>

                    {/* Job selector tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {[
                        { id: 4, label: 'Full Stack' },
                        { id: 5, label: 'AI/ML' },
                        { id: 6, label: 'Frontend' },
                        { id: 1, label: 'Professor' },
                      ].map(({ id, label }) => (
                        <button key={id} onClick={() => handleJobTabChange(id)} style={{
                          padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                          background: selectedJobId === id ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                          color: selectedJobId === id ? 'white' : 'var(--text-secondary)',
                          transition: 'all 0.15s',
                        }}>
                          {label}
                        </button>
                      ))}
                    </div>

                    {skillGap ? (
                      <>
                        {/* Match bar */}
                        <div style={{ marginBottom: '1.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Match</span>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: skillGap.matchPercentage >= 70 ? '#4ade80' : skillGap.matchPercentage >= 40 ? '#f59e0b' : '#f87171' }}>
                              {skillGap.matchPercentage}%
                            </span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skillGap.matchPercentage}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              style={{ height: '100%', borderRadius: '9999px', background: skillGap.matchPercentage >= 70 ? '#4ade80' : skillGap.matchPercentage >= 40 ? '#f59e0b' : '#f87171' }}
                            />
                          </div>
                        </div>

                        {/* Existing Skills */}
                        {skillGap.existing?.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>✓ You Have ({skillGap.existing.length})</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {skillGap.existing.map((s, i) => <SkillChip key={i} skill={s} variant="success" />)}
                            </div>
                          </div>
                        )}

                        {/* Missing Skills */}
                        {skillGap.missing?.length > 0 && (
                          <div>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>✗ Missing ({skillGap.missing.length})</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {skillGap.missing.map((s, i) => <SkillChip key={i} skill={s} variant="danger" />)}
                            </div>
                          </div>
                        )}

                        {skillGap.existing?.length === 0 && skillGap.missing?.length === 0 && (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No skill data available for this job.</p>
                        )}
                      </>
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading skill gap analysis…</p>
                    )}
                  </div>
                </div>

                {/* ── Row 3: All Skills Extracted */}
                {resumeData.skills?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={16} style={{ color: 'var(--primary)' }} /> Extracted Skills
                      <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{resumeData.skills.length} detected</span>
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {resumeData.skills.map((s, i) => <SkillChip key={i} skill={s} />)}
                    </div>
                  </div>
                )}

                {/* ── Row 4: Learning Recommendations */}
                {recommendations.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen size={16} style={{ color: '#06b6d4' }} /> Learning Recommendations
                      <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Based on missing skills</span>
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.875rem' }}>
                      {recommendations.map((rec, i) => (
                        <motion.div key={i} whileHover={{ y: -2 }} style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '0.875rem', padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(6,182,212,0.12)', borderRadius: '0.5rem', color: '#06b6d4', flexShrink: 0 }}>
                              <BookOpen size={16} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 4px', lineHeight: 1.3 }}>{rec.course}</p>
                              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>{rec.provider}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{rec.difficulty}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>{rec.duration}</span>
                          </div>
                          <a href={rec.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#06b6d4', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none' }}>
                            Start Learning <ExternalLink size={11} />
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Row 5: Job Matches */}
                {jobMatches.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Briefcase size={16} style={{ color: '#a855f7' }} /> Recommended Jobs
                      <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Sorted by match %</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {jobMatches.map((job, i) => (
                        <motion.div key={job.id} whileHover={{ x: 4 }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', flexWrap: 'wrap' }}>
                          {/* Match Badge */}
                          <div style={{
                            minWidth: '54px', height: '54px', borderRadius: '0.75rem', flexShrink: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: job.matchPercentage >= 70 ? 'rgba(34,197,94,0.12)' : job.matchPercentage >= 40 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                            border: `1px solid ${job.matchPercentage >= 70 ? 'rgba(34,197,94,0.25)' : job.matchPercentage >= 40 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`,
                          }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: job.matchPercentage >= 70 ? '#4ade80' : job.matchPercentage >= 40 ? '#f59e0b' : '#f87171', lineHeight: 1 }}>{job.matchPercentage}%</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 600 }}>match</span>
                          </div>
                          {/* Job Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 4px', lineHeight: 1.3 }}>{job.title}</p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Building2 size={11} /> {job.company}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={11} /> {job.location}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <DollarSign size={11} /> {job.salary}
                              </span>
                            </div>
                          </div>
                          {/* Apply Button */}
                          <button style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            Apply <ArrowRight size={13} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
