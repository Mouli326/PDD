import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Briefcase, Check, Loader2, AlertCircle, Award } from 'lucide-react';
import { apiUrl } from '../api.js';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // login or register
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('academia'); // academia or industry

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const endpoint = apiUrl(mode === 'register' ? '/api/auth/register' : '/api/auth/login');
    const payload = mode === 'register' 
      ? { name, email, password, role }
      : { email, password };

    const performLocalAuth = () => {
      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('hirehub_users') || '[]');
      } catch(e) { localUsers = []; }

      let userObj = null;

      if (mode === 'register') {
        const existing = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          userObj = existing;
        } else {
          userObj = {
            id: Date.now(),
            name: name || email.split('@')[0],
            email: email,
            role: role || 'academia',
            skills: [],
            resume_name: null
          };
          localUsers.push(userObj);
          localStorage.setItem('hirehub_users', JSON.stringify(localUsers));
        }
      } else {
        const found = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        userObj = found || {
          id: Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'academia',
          skills: [],
          resume_name: null
        };
      }

      const mockToken = 'mobile_session_' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('hirehub_user', JSON.stringify(userObj));

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onAuthSuccess(userObj);
        onClose();
      }, 1000);
    };

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          performLocalAuth();
          return null;
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed');
        }
        return data;
      })
      .then((data) => {
        if (!data) return;
        setIsLoading(false);
        setIsSuccess(true);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('hirehub_user', JSON.stringify(data.user));

        setTimeout(() => {
          setIsSuccess(false);
          onAuthSuccess(data.user);
          onClose();
        }, 1000);
      })
      .catch((err) => {
        if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('unreachable'))) {
          performLocalAuth();
        } else {
          setIsLoading(false);
          setErrorMsg(err.message || 'An error occurred during authentication.');
        }
      });
  };

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass p-8 border border-white/10 shadow-2xl z-10 overflow-hidden"
          >
            {/* Top Close Button */}
            <button 
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {!isLoading && !isSuccess && (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === 'login' ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'login' ? 15 : -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {mode === 'login' 
                        ? 'Sign in to access your dashboard & application dossier' 
                        : 'Register to unlock personalized AI skill gap metrics'}
                    </p>
                  </div>

                  {/* Auth Tabs */}
                  <div style={{display:'flex', background:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'10px', marginBottom:'1.5rem', border:'1px solid rgba(255,255,255,0.06)', gap:'4px'}}>
                    <button
                      type="button"
                      style={{flex:1, padding:'10px 0', borderRadius:'8px', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                        background: mode === 'login' ? 'var(--primary)' : 'transparent',
                        color: mode === 'login' ? 'white' : 'var(--text-secondary)'
                      }}
                      onClick={() => handleTabChange('login')}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      style={{flex:1, padding:'10px 0', borderRadius:'8px', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', border:'none', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                        background: mode === 'register' ? 'var(--primary)' : 'transparent',
                        color: mode === 'register' ? 'white' : 'var(--text-secondary)'
                      }}
                      onClick={() => handleTabChange('register')}
                    >
                      Register
                    </button>
                  </div>

                  {/* Error Notification Banner */}
                  {errorMsg && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs text-red-400">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {mode === 'register' && (
                      <div style={{display:'flex', flexDirection:'column', gap:'0.375rem'}}>
                        <label style={{fontSize:'0.8rem', fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.02em'}}>Full Name</label>
                        <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                          <User style={{position:'absolute', left:'14px', color:'var(--text-secondary)', flexShrink:0, pointerEvents:'none'}} size={17} />
                          <input 
                            type="text" 
                            required 
                            placeholder="Dr. Alexander Vance"
                            style={{width:'100%', padding:'0.75rem 1rem 0.75rem 2.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.5rem', color:'white', fontFamily:'inherit', fontSize:'0.9rem', outline:'none', boxSizing:'border-box'}}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div style={{display:'flex', flexDirection:'column', gap:'0.375rem'}}>
                      <label style={{fontSize:'0.8rem', fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.02em'}}>Email Address</label>
                      <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                        <Mail style={{position:'absolute', left:'14px', color:'var(--text-secondary)', flexShrink:0, pointerEvents:'none'}} size={17} />
                        <input 
                          type="email" 
                          required 
                          placeholder="vance@university.edu"
                          style={{width:'100%', padding:'0.75rem 1rem 0.75rem 2.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.5rem', color:'white', fontFamily:'inherit', fontSize:'0.9rem', outline:'none', boxSizing:'border-box'}}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', gap:'0.375rem'}}>
                      <label style={{fontSize:'0.8rem', fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.02em'}}>Password</label>
                      <div style={{position:'relative', display:'flex', alignItems:'center'}}>
                        <Lock style={{position:'absolute', left:'14px', color:'var(--text-secondary)', flexShrink:0, pointerEvents:'none'}} size={17} />
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••"
                          style={{width:'100%', padding:'0.75rem 1rem 0.75rem 2.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.5rem', color:'white', fontFamily:'inherit', fontSize:'0.9rem', outline:'none', boxSizing:'border-box'}}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                                {mode === 'register' && (
                      <div style={{display:'flex', flexDirection:'column', gap:'0.375rem'}}>
                        <label style={{fontSize:'0.8rem', fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.02em'}}>Primary Role / Path</label>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem'}}>
                          <button
                            type="button"
                            onClick={() => setRole('academia')}
                            style={{padding:'0.875rem 0.5rem', borderRadius:'0.5rem', border: role === 'academia' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', transition:'all 0.2s', background: role === 'academia' ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.04)', color: role === 'academia' ? 'white' : 'var(--text-secondary)', textAlign:'center', lineHeight:'1.3'}}
                          >
                            <Award size={20} />
                            Academia &amp; Research
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('industry')}
                            style={{padding:'0.875rem 0.5rem', borderRadius:'0.5rem', border: role === 'industry' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', transition:'all 0.2s', background: role === 'industry' ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.04)', color: role === 'industry' ? 'white' : 'var(--text-secondary)', textAlign:'center', lineHeight:'1.3'}}
                          >
                            <Briefcase size={20} />
                            Industry &amp; Tech
                          </button>
                        </div>
                      </div>
                    )}

                    <button type="submit" style={{width:'100%', padding:'0.875rem', background:'var(--primary)', color:'white', border:'none', borderRadius:'0.5rem', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', marginTop:'0.5rem', transition:'all 0.2s'}}>
                      {mode === 'login' ? 'Sign In to Account' : 'Register Now'}
                    </button>
                  </form>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center flex flex-col items-center justify-center"
                >
                  <Loader2 size={54} className="text-primary animate-spin mb-4" />
                  <h4 className="text-xl font-bold mb-2">Authenticating</h4>
                  <p className="text-text-secondary text-sm max-w-xs">
                    Securing your credentials and loading your AI-driven skill matrices...
                  </p>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center"
                >
                  <div className="p-4 bg-secondary/15 rounded-full text-secondary mb-4 border border-secondary/20 shadow-lg">
                    <Check size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Welcome!</h4>
                  <p className="text-text-secondary text-sm">
                    {mode === 'login' ? 'Successfully logged in to your account.' : 'Account registered successfully!'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
