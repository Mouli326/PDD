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
          onClose();
          // Reset form fields
          setName('');
          setEmail('');
          setPassword('');
        }, 1200);
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMsg(err.message || 'An error occurred during authentication.');
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
                  <div className="flex bg-white/5 p-1 rounded-lg mb-6 border border-white/5">
                    <button
                      type="button"
                      className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all cursor-pointer ${
                        mode === 'login' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-text-secondary hover:text-white'
                      }`}
                      onClick={() => handleTabChange('login')}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all cursor-pointer ${
                        mode === 'register' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-text-secondary hover:text-white'
                      }`}
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
                      <label className="label">Institutional / Professional Email</label>
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
                            className={`p-3 rounded-lg border font-semibold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
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
                            className={`p-3 rounded-lg border font-semibold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
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
