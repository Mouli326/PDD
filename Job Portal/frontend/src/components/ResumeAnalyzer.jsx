import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeAnalyzer({ uploadedFileName, onUploadSuccess }) {
  const [status, setStatus] = useState('idle'); // idle, uploading, analyzed, error
  const [errorMsg, setErrorMsg] = useState('');
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const fileInputRef = useRef(null);

  // Sync status if file was already loaded in profile on mount
  useEffect(() => {
    if (uploadedFileName && status === 'idle') {
      setStatus('analyzed');
    }
  }, [uploadedFileName]);

  const handleUploadClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('error');
      setErrorMsg('Please Sign In first to activate Resume Intelligence and parse your CV.');
      return;
    }
    setErrorMsg('');
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('error');
      setErrorMsg('Authentication session expired. Please sign in again.');
      return;
    }

    setStatus('uploading');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('resume', file);

    fetch('/api/resume/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to parse resume');
        }
        return data;
      })
      .then((data) => {
        setStatus('analyzed');
        onUploadSuccess(data.resumeName, data.skills);
      })
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message || 'Error occurred while analyzing resume.');
      });
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="resume-analyzer">
      <div className="container">
        <div className="max-w-4xl mx-auto glass p-10 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText size={160} />
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Resume Intelligence</h2>
            <p className="text-text-secondary mb-10">Upload your CV (PDF) to unlock personalized matching and gap analysis.</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              style={{ display: 'none' }} 
            />

            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-12 hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={handleUploadClick}
                >
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full text-primary mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <p className="text-lg font-semibold mb-1">Click to select PDF resume</p>
                    <p className="text-text-secondary text-sm">Secure live parsing (Max 5MB)</p>
                  </div>
                </motion.div>
              )}

              {status === 'uploading' && (
                <motion.div 
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12"
                >
                  <div className="flex flex-col items-center">
                    <Loader2 size={48} className="text-primary animate-spin mb-4" />
                    <p className="text-lg font-semibold">AI Extracting CV Text...</p>
                    <p className="text-text-secondary">Mapping professional competencies and core skills</p>
                  </div>
                </motion.div>
              )}

              {status === 'analyzed' && (
                <motion.div 
                  key="analyzed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-secondary/10 border border-secondary/20 rounded-2xl p-8 text-left"
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="p-4 bg-secondary/20 rounded-full text-secondary mb-4">
                      <Check size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Analysis Complete!</h3>
                    <p className="text-text-secondary text-sm">
                      Successfully processed <span className="text-white font-semibold">{uploadedFileName}</span>
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Left: ATS Sub-Metrics Breakdown */}
                    <div className="p-6 bg-black/35 rounded-xl border border-white/5 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-base mb-1 text-white">ATS Granular Audit Rating</h4>
                          <p className="text-[10px] text-text-secondary font-semibold">Granular parser compatibility across core dimensions.</p>
                        </div>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[8px] font-black uppercase tracking-wider animate-pulse">
                          Hover to Inspect
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        
                        {/* Gauge 1: Keywords */}
                        <div 
                          className="flex flex-col items-center cursor-help group transition-transform duration-300 hover:scale-105"
                          onMouseEnter={() => setHoveredMetric('keywords')}
                          onMouseLeave={() => setHoveredMetric(null)}
                        >
                          <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <defs>
                                <linearGradient id="keywordsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#06b6d4" />
                                  <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                              </defs>
                              <circle cx="32" cy="32" r="28" className="stroke-white/5 fill-none" strokeWidth="4" />
                              <circle cx="32" cy="32" r="28" stroke="url(#keywordsGrad)" className="fill-none" strokeWidth="4.5" strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28 * (1 - 0.92)} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-xs font-black text-white group-hover:text-secondary transition-colors">92%</span>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase text-text-secondary group-hover:text-white transition-colors">Keywords</span>
                        </div>

                        {/* Gauge 2: Formatting */}
                        <div 
                          className="flex flex-col items-center cursor-help group transition-transform duration-300 hover:scale-105"
                          onMouseEnter={() => setHoveredMetric('format')}
                          onMouseLeave={() => setHoveredMetric(null)}
                        >
                          <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <defs>
                                <linearGradient id="formatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#a855f7" />
                                  <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                              </defs>
                              <circle cx="32" cy="32" r="28" className="stroke-white/5 fill-none" strokeWidth="4" />
                              <circle cx="32" cy="32" r="28" stroke="url(#formatGrad)" className="fill-none" strokeWidth="4.5" strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28 * (1 - 0.85)} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-xs font-black text-white group-hover:text-primary transition-colors">85%</span>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase text-text-secondary group-hover:text-white transition-colors">Format</span>
                        </div>

                        {/* Gauge 3: Impact */}
                        <div 
                          className="flex flex-col items-center cursor-help group transition-transform duration-300 hover:scale-105"
                          onMouseEnter={() => setHoveredMetric('impact')}
                          onMouseLeave={() => setHoveredMetric(null)}
                        >
                          <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <defs>
                                <linearGradient id="impactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#ec4899" />
                                  <stop offset="100%" stopColor="#f43f5e" />
                                </linearGradient>
                              </defs>
                              <circle cx="32" cy="32" r="28" className="stroke-white/5 fill-none" strokeWidth="4" />
                              <circle cx="32" cy="32" r="28" stroke="url(#impactGrad)" className="fill-none" strokeWidth="4.5" strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28 * (1 - 0.78)} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-xs font-black text-white group-hover:text-accent transition-colors">78%</span>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase text-text-secondary group-hover:text-white transition-colors">Impact</span>
                        </div>

                      </div>

                      {/* Interactive Feedback Box */}
                      <div className="text-[10px] text-text-secondary bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed min-h-[75px] flex items-center transition-all duration-300">
                        {!hoveredMetric && (
                          <span className="text-text-secondary">
                            🎯 <strong>Interactive coaching:</strong> Hover over any granular circular audit gauge above to inspect dynamic diagnostic reports and tailored resume adjustments!
                          </span>
                        )}
                        {hoveredMetric === 'keywords' && (
                          <span className="text-secondary font-medium animate-fadeIn">
                            🔍 <strong>Keyword Density (92%):</strong> Mapped 12 technical frameworks (React, Node.js, SQL). Lacking: <em>"Docker", "Redis"</em>. Action: Add these matching key terms to your core competency lists to boost parser indexing!
                          </span>
                        )}
                        {hoveredMetric === 'format' && (
                          <span className="text-primary font-medium animate-fadeIn">
                            📄 <strong>Format Clarity (85%):</strong> Standard single-column alignment and standard sans typography (Inter, Outfit) detected. Parser reads cleanly. Tip: Keep margins at a full 1-inch and avoid dual-column grids.
                          </span>
                        )}
                        {hoveredMetric === 'impact' && (
                          <span className="text-accent font-medium animate-fadeIn">
                            ⚡ <strong>Action & Impact (78%):</strong> Identified 4 strong active verbs (<em>"engineered", "led", "designed"</em>). Action tip: Quantify statements (e.g. <em>"Engineered 12 React interfaces, reducing page loads by 35%"</em>).
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Gaps and suggestions */}
                    <div className="p-6 bg-black/35 rounded-xl border border-white/5 space-y-4">
                      <h4 className="font-extrabold text-base text-white">ATS Formatting & Content Gaps</h4>
                      <ul className="space-y-3.5 text-xs text-text-secondary">
                        <li className="flex items-start gap-2.5">
                          <span className="text-primary font-bold shrink-0">👉</span>
                          <span><strong>Quantify achievements:</strong> Include metrics like <em>"spurred efficiency by 25%"</em> or <em>"co-authored 2 papers"</em>.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-primary font-bold shrink-0">👉</span>
                          <span><strong>Format clean listings:</strong> Place technical skills in plain comma-separated blocks. ATS readers parse raw text better.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-primary font-bold shrink-0">👉</span>
                          <span><strong>Add portfolios:</strong> Link GitHub, LinkedIn, or Google Scholar portfolios to substantiate background credentials.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <button 
                      className="text-secondary font-semibold hover:underline cursor-pointer bg-transparent border-none text-sm"
                      onClick={handleReset}
                    >
                      Process another resume
                    </button>
                  </div>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-red-500/20 rounded-full text-red-400 mb-4 animate-bounce">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Action Required</h3>
                    <p className="text-sm text-text-secondary max-w-md mb-6">{errorMsg}</p>
                    
                    <button 
                      className="btn btn-primary px-6 py-2.5 text-sm"
                      onClick={handleReset}
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
