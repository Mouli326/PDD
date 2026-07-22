import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Briefcase, Check, Loader2, AlertCircle, Award } from 'lucide-react';
import { apiUrl } from '../api.js';

export default function LoginPage({ onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // login or register
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

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed');
        }
        return data;
      })
      .then((data) => {
        setIsLoading(false);
        setIsSuccess(true);
        
        // Save JWT Token
        localStorage.setItem('token', data.token);

        setTimeout(() => {
          setIsSuccess(false);
          onAuthSuccess(data.user);
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMsg(err.message || 'An error occurred during authentication.');
      });
  };

  return (
    <div className="container py-12 flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass p-10 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isLoading && !isSuccess && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-8">
                <span className="text-xs text-primary font-extrabold uppercase tracking-wider block mb-2">HireHub Security Portal</span>
                <h3 className="text-3xl font-extrabold text-white mb-2">
                  {mode === 'login' ? 'Access Your Dossier' : 'Join HireHub Today'}
                </h3>
                <p className="text-text-secondary text-sm">
                  {mode === 'login' 
                    ? 'Sign in to access your skills dashboard and matches' 
                    : 'Register to unlock AI resume audits and live skill tests'}
                </p>
              </div>

              {/* Login / Register tabs */}
              <div className="flex bg-white/5 p-1 rounded-lg mb-6 border border-white/5">
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-md font-bold text-sm transition-all cursor-pointer border-none ${
                    mode === 'login' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-secondary bg-transparent hover:text-white'
                  }`}
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-md font-bold text-sm transition-all cursor-pointer border-none ${
                    mode === 'register' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-text-secondary bg-transparent hover:text-white'
                  }`}
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                >
                  Register
                </button>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                      <input 
                        type="text" 
                        required 
                        placeholder="Dr. Alexander Vance"
                        className="input"
                        style={{ paddingLeft: '2.5rem' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input 
                      type="email" 
                      required 
                      placeholder="vance@university.edu"
                      className="input"
                      style={{ paddingLeft: '2.5rem' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      className="input"
                      style={{ paddingLeft: '2.5rem' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="label">Primary Role / Path</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('academia')}
                        className={`p-3 rounded-lg border font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          role === 'academia'
                            ? 'bg-primary/10 border-primary text-white'
                            : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
                        }`}
                      >
                        <Award size={18} />
                        Academia & Research
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('industry')}
                        className={`p-3 rounded-lg border font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          role === 'industry'
                            ? 'bg-primary/10 border-primary text-white'
                            : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
                        }`}
                      >
                        <Briefcase size={18} />
                        Industry & Tech
                      </button>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full py-3 text-sm font-bold mt-6">
                  {mode === 'login' ? 'Sign In to Account' : 'Register Now'}
                </button>
              </form>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
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
              className="py-12 text-center flex flex-col items-center justify-center"
            >
              <div className="p-4 bg-secondary/15 rounded-full text-secondary mb-4 border border-secondary/20 shadow-lg">
                <Check size={40} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Welcome to HireHub!</h4>
              <p className="text-text-secondary text-sm">
                Successfully logged in. Activating skill-matching command engines...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
