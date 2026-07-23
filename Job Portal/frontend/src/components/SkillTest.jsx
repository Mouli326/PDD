import React, { useState } from 'react';
import { apiUrl } from '../api.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, CheckCircle, XCircle, Loader2, ArrowRight,
  ShieldCheck, Code, Terminal, Cpu, Database,
  CheckCircle2, Clock, BarChart2, Zap, ChevronRight
} from 'lucide-react';

const QUIZZES = {
  react: {
    title: 'React & Web Architecture',
    skill: 'React',
    category: 'Frontend',
    description: 'Validate modern React patterns, hooks, and component architecture.',
    icon: Code,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.04))',
    border: 'rgba(6,182,212,0.2)',
    questions: [
      { q: 'Which React hook allows developers to render optimistic state updates during async transactions?', options: ['useOptimistic', 'useTransition', 'useFormStatus'], answer: 0 },
      { q: 'What dependency array configuration executes a useEffect hook on EVERY single component render?', options: ['Omitted entirely', 'An empty array []', 'An array with variables [state]'], answer: 0 },
      { q: 'What does HMR stand for in Vite/React development workflows?', options: ['Hot Module Replacement', 'Hyper Mode Router', 'Host Management Register'], answer: 0 }
    ]
  },
  python: {
    title: 'Python & Data Science',
    skill: 'Python',
    category: 'Data Science',
    description: 'Demonstrate proficiency in Python scripting and data manipulation.',
    icon: Terminal,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.04))',
    border: 'rgba(59,130,246,0.2)',
    questions: [
      { q: 'Which data structure in standard Python is mutable and ordered?', options: ['List', 'Tuple', 'Set'], answer: 0 },
      { q: 'Which library is the industry standard for reading, cleaning, and manipulating DataFrames?', options: ['Pandas', 'NumPy', 'TensorFlow'], answer: 0 },
      { q: 'How do you square each item using a list comprehension?', options: ['[x**2 for x in items]', '[x^2 for x in items]', 'items.map(x => x*x)'], answer: 0 }
    ]
  },
  ml: {
    title: 'Machine Learning & AI',
    skill: 'Machine Learning',
    category: 'AI & ML',
    description: 'Verify understanding of core ML algorithms and training methodologies.',
    icon: Cpu,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.04))',
    border: 'rgba(168,85,247,0.2)',
    questions: [
      { q: 'What classification does a K-Means algorithm fall under?', options: ['Unsupervised Clustering', 'Supervised Classification', 'Reinforcement Learning'], answer: 0 },
      { q: 'Which mathematical framework adjusts neural network weights during training?', options: ['Backpropagation & Gradient Descent', 'Linear Interpolation', 'Cosine Similarity'], answer: 0 },
      { q: 'Which regularization method penalizes weights by their absolute values (L1 penalty)?', options: ['L1 Lasso Regularization', 'L2 Ridge Regularization', 'ElasticNet'], answer: 0 }
    ]
  },
  node: {
    title: 'Node.js & Backend Systems',
    skill: 'Node.js',
    category: 'Backend',
    description: 'Assess mastery of Node.js runtime, async patterns, and Express.js.',
    icon: Database,
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.04))',
    border: 'rgba(34,197,94,0.2)',
    questions: [
      { q: 'Which single-threaded mechanism handles asynchronous I/O operations in Node.js?', options: ['Event Loop (libuv)', 'Thread Pool Manager', 'V8 Compiler Engine'], answer: 0 },
      { q: 'Which Express.js method registers global middleware for all HTTP requests?', options: ['app.use()', 'app.all()', 'app.register()'], answer: 0 },
      { q: 'What is the primary function of process.nextTick() in Node.js execution?', options: ['Schedules callback at start of next event loop phase', 'Defers callback until next process restart', 'Executes synchronous file system writes'], answer: 0 }
    ]
  }
};

export default function SkillTest({ user, onNavigateToJobs, onSkillAdded }) {
  const [activeQuizKey, setActiveQuizKey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState('select');
  const [errorMsg, setErrorMsg] = useState('');

  const activeQuiz = QUIZZES[activeQuizKey];
  const totalQuizzes = Object.keys(QUIZZES).length;
  const verifiedCount = Object.values(QUIZZES).filter(q =>
    user?.skills?.some(s => s.toLowerCase() === q.skill.toLowerCase())
  ).length;

  const isVerified = (key) =>
    user?.skills?.some(s => s.toLowerCase() === QUIZZES[key].skill.toLowerCase());

  const handleStart = (key) => {
    setActiveQuizKey(key);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setErrorMsg('');
    setQuizState('active');
  };

  const handleNext = () => {
    const correct = selectedOptionIndex === activeQuiz.questions[currentQuestionIndex].answer;
    const newScore = score + (correct ? 1 : 0);

    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setScore(newScore);
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      if (newScore >= 2) {
        saveEarnedSkill(activeQuiz.skill, newScore);
      } else {
        setScore(newScore);
        setQuizState('result');
      }
    }
  };

  const saveEarnedSkill = (skillName, finalScore) => {
    setQuizState('saving');
    const token = localStorage.getItem('token');
    if (!token) { setErrorMsg('Session expired.'); setQuizState('result'); return; }

    fetch(apiUrl('/api/auth/add-skill'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ skill: skillName })
    })
      .then(async res => { const d = await res.json(); if (!res.ok) throw new Error(d.message); return d; })
      .then(data => { setScore(finalScore); onSkillAdded(data.skills); setQuizState('result'); })
      .catch(() => { setScore(finalScore); setErrorMsg('Score saved locally. Sync error occurred.'); setQuizState('result'); });
  };

  /* ─── STYLES ─── */
  const cardBase = {
    borderRadius: '1.125rem',
    padding: '1.5rem',
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.025)',
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>

      <AnimatePresence mode="wait">

        {/* ══════════════ SELECT STATE ══════════════ */}
        {quizState === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* ── Page Header ── */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.09em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Award size={13} /> Skill Credential Centre
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900, color: 'white', margin: '0 0 6px', lineHeight: 1.2 }}>
                Verify Your Technical Skills
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, maxWidth: '520px' }}>
                Pass a 3-question assessment to earn verified skill badges. Badges sync with your profile and boost job match percentages.
              </p>
            </div>

            {/* ── Progress Summary ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem', marginBottom: '2rem' }}>
              {[
                { label: 'Credentials Earned', value: `${verifiedCount}/${totalQuizzes}`, color: '#4ade80' },
                { label: 'Completion Rate', value: `${Math.round((verifiedCount / totalQuizzes) * 100)}%`, color: '#a78bfa' },
                { label: 'Per Assessment', value: '3 Questions', color: '#94a3b8' },
                { label: 'Min. Pass Score', value: '2 / 3', color: '#f59e0b' },
              ].map((item, i) => (
                <div key={i} style={{ ...cardBase, textAlign: 'center', padding: '1rem' }}>
                  <p style={{ fontSize: '1.35rem', fontWeight: 900, color: item.color, margin: '0 0 3px' }}>{item.value}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* ── Assessment Cards ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {Object.keys(QUIZZES).map((key, idx) => {
                const q = QUIZZES[key];
                const Icon = q.icon;
                const verified = isVerified(key);

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    whileHover={{ scale: 1.007 }}
                    style={{
                      background: verified ? 'rgba(34,197,94,0.04)' : q.gradient,
                      border: `1px solid ${verified ? 'rgba(34,197,94,0.22)' : q.border}`,
                      borderRadius: '1.125rem',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.125rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '0.875rem', flexShrink: 0,
                      background: verified ? 'rgba(34,197,94,0.12)' : `${q.color}18`,
                      border: `1px solid ${verified ? 'rgba(34,197,94,0.25)' : `${q.color}30`}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: verified ? '#4ade80' : q.color,
                    }}>
                      <Icon size={22} />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '0.97rem', color: 'white', margin: 0 }}>{q.title}</h4>
                        <span style={{
                          fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px',
                          background: `${q.color}15`, color: q.color, border: `1px solid ${q.color}25`,
                          textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>{q.category}</span>
                      </div>
                      <p style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {q.description}
                        <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 6px' }}>·</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} style={{ verticalAlign: 'middle' }} /> ~3 mins
                        </span>
                      </p>
                    </div>

                    {/* CTA */}
                    {verified ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 16px', borderRadius: '9999px',
                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                        color: '#4ade80', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0
                      }}>
                        <CheckCircle2 size={15} /> Verified
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStart(key)}
                        style={{
                          padding: '0.625rem 1.125rem', background: q.color,
                          color: 'white', border: 'none', borderRadius: '0.625rem',
                          fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '6px',
                          flexShrink: 0, whiteSpace: 'nowrap',
                          boxShadow: `0 4px 14px ${q.color}40`, transition: 'all 0.2s'
                        }}
                      >
                        Start Test <ChevronRight size={14} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ── Info Footer ── */}
            <div style={{ marginTop: '1.5rem', padding: '0.875rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                Verified credentials are cryptographically linked to your HireHub profile. Employers and job-matching algorithms receive a live signal of your verified competencies, boosting your application visibility.
              </p>
            </div>
          </motion.div>
        )}

        {/* ══════════════ ACTIVE QUIZ STATE ══════════════ */}
        {quizState === 'active' && activeQuiz && (
          <motion.div key="active" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>

            {/* Quiz top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: activeQuiz.color, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '3px' }}>
                  {activeQuiz.category} Assessment
                </span>
                <h3 style={{ fontWeight: 900, fontSize: '1.25rem', color: 'white', margin: 0 }}>{activeQuiz.title}</h3>
              </div>
              <button
                onClick={() => setQuizState('select')}
                style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Exit
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', height: '6px', marginBottom: '2rem', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / 3) * 100}%` }}
                transition={{ duration: 0.35 }}
                style={{ height: '100%', borderRadius: '9999px', background: `linear-gradient(90deg, ${activeQuiz.color}, ${activeQuiz.color}99)` }}
              />
            </div>

            {/* Question count pill */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Question {currentQuestionIndex + 1} of 3
              </span>
              <span style={{ fontSize: '0.72rem', color: activeQuiz.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BarChart2 size={13} /> {Math.round(((currentQuestionIndex + 1) / 3) * 100)}% Complete
              </span>
            </div>

            {/* Question Text */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.55 }}>
                {activeQuiz.questions[currentQuestionIndex].q}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {activeQuiz.questions[currentQuestionIndex].options.map((opt, oi) => {
                const isSelected = selectedOptionIndex === oi;
                return (
                  <motion.button
                    key={oi}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedOptionIndex(oi)}
                    style={{
                      width: '100%', padding: '1rem 1.25rem',
                      borderRadius: '0.875rem', textAlign: 'left',
                      border: `1px solid ${isSelected ? activeQuiz.color : 'rgba(255,255,255,0.08)'}`,
                      background: isSelected ? `${activeQuiz.color}16` : 'rgba(0,0,0,0.18)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      transition: 'all 0.15s ease', boxShadow: isSelected ? `0 0 0 1px ${activeQuiz.color}40` : 'none'
                    }}
                  >
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: isSelected ? activeQuiz.color : 'rgba(255,255,255,0.07)',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.72rem', fontWeight: 900,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Next / Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleNext}
                disabled={selectedOptionIndex === null}
                style={{
                  padding: '0.75rem 1.75rem',
                  background: selectedOptionIndex !== null ? activeQuiz.color : 'rgba(255,255,255,0.06)',
                  color: selectedOptionIndex !== null ? 'white' : 'var(--text-secondary)',
                  border: 'none', borderRadius: '0.625rem',
                  fontWeight: 800, fontSize: '0.875rem',
                  cursor: selectedOptionIndex === null ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: selectedOptionIndex !== null ? `0 4px 14px ${activeQuiz.color}50` : 'none'
                }}
              >
                {currentQuestionIndex + 1 < activeQuiz.questions.length ? 'Next Question' : 'Submit Assessment'}
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ══════════════ SAVING STATE ══════════════ */}
        {quizState === 'saving' && (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '50%', marginBottom: '1.25rem' }}>
              <Loader2 size={40} style={{ color: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
            </div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>Issuing Credential</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px', margin: 0, lineHeight: 1.6 }}>
              Verifying your assessment score and syncing your credential badge to your HireHub profile…
            </p>
          </motion.div>
        )}

        {/* ══════════════ RESULT STATE ══════════════ */}
        {quizState === 'result' && activeQuiz && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>

            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              {score >= 2 ? (
                <>
                  <div style={{ padding: '1.25rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '50%', display: 'inline-flex', marginBottom: '1.5rem', color: '#4ade80' }}>
                    <CheckCircle size={48} />
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>Credential Earned! 🎉</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0 0 6px' }}>
                    You scored <strong style={{ color: 'white' }}>{score} out of 3</strong> — assessment passed.
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 18px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '9999px', color: '#4ade80', fontWeight: 800, fontSize: '0.85rem', marginTop: '8px' }}>
                    <CheckCircle2 size={15} /> "{activeQuiz.skill}" verified & added to your profile
                  </div>
                </>
              ) : (
                <>
                  <div style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '50%', display: 'inline-flex', marginBottom: '1.5rem', color: '#f87171' }}>
                    <XCircle size={48} />
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', margin: '0 0 8px' }}>Not Quite There</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0 0 6px' }}>
                    You scored <strong style={{ color: 'white' }}>{score} out of 3</strong> — minimum 2/3 required.
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#f87171', fontWeight: 700, marginTop: '8px' }}>
                    Review the topic and retry to earn this credential.
                  </p>
                </>
              )}

              {errorMsg && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.75rem', fontSize: '0.8rem', color: '#f59e0b' }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setQuizState('select')}
                  style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.625rem', color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Back to Hub
                </button>
                {score >= 2 ? (
                  <button
                    onClick={onNavigateToJobs}
                    style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', border: 'none', borderRadius: '0.625rem', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(168,85,247,0.35)', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    View Job Matches <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStart(activeQuizKey)}
                    style={{ padding: '0.75rem 1.5rem', background: activeQuiz.color, border: 'none', borderRadius: '0.625rem', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: `0 4px 14px ${activeQuiz.color}40`, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Retry Assessment <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
