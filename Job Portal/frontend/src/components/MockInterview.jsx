import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, VideoOff, Play, Square, Award, MessageSquare, 
  RefreshCw, Sparkles, ChevronRight, Volume2, Mic, AlertCircle, HelpCircle
} from 'lucide-react';

export default function MockInterview({ user, onNavigateToJobs, onVideoCompleted }) {
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [interviewState, setInterviewState] = useState('setup'); // setup, warm-up, recording, analyzing, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [cameraPermission, setCameraPermission] = useState('unknown'); // unknown, granted, denied
  
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  // Customized Interview Questions based on career path (Academia vs Industry)
  const isAcademia = user?.role === 'academia';
  const questions = isAcademia ? [
    "Describe your active academic research portfolio and your future plan to secure research grants (NSF, NIH) at HireHub University.",
    "What is your pedagogy philosophy for teaching advanced computer science courses, and how do you mentor diverse doctoral candidates?",
    "How does your peer-reviewed scientific publishing history align with our institution's vision for engineering excellence?"
  ] : [
    "Walk me through your professional background and highlight your core expertise in React, Node.js, and modern full-stack development.",
    "How do you analyze and optimize critical performance bottlenecks like React DOM reconciliations or heavy SQLite database indexing?",
    "Describe a complex production bug or race condition you solved. What debugging tools and mitigation strategies did you deploy?"
  ];

  const [videoFilter, setVideoFilter] = useState('normal'); // normal, cyberpunk, holographic

  // Request Webcam Access
  const startCamera = async () => {
    try {
      const constraints = { video: true, audio: true };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraPermission('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setInterviewState('warm-up');
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraPermission('denied');
    }
  };

  // Stop Webcam Access
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      clearInterval(timerRef.current);
    };
  }, [stream]);

  // Handle Recording Controls
  const startRecording = () => {
    setRecording(true);
    setInterviewState('recording');
    setSecondsElapsed(0);
    timerRef.current = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSecondsElapsed(0);
    } else {
      stopRecordingAndAnalyze();
    }
  };

  const stopRecordingAndAnalyze = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    stopCamera();
    setInterviewState('analyzing');

    // Simulate AI deep analysis delay
    setTimeout(() => {
      setInterviewState('results');
      if (onVideoCompleted) {
        onVideoCompleted(); // Notify parent to boost readiness score
      }
    }, 3000);
  };

  // Format time display
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Simulated AI Interview Results metrics
  const simulatedResults = {
    score: 87,
    pacing: "128 WPM (Optimal speech cadence)",
    duration: "2 min 14 sec",
    fillers: {
      um: 2,
      like: 1,
      basically: 0
    },
    positiveKeywords: isAcademia 
      ? ["grant funding", "peer-reviewed", "pedagogy", "curriculum", "tenure-track"]
      : ["Virtual DOM", "concurrency", "scalability", "indexing", "reconciliation"],
    communicationFeedback: "Excellent pacing and clear articulation. Maintaining great eye contact. Try to keep your hand gestures closer to your chest.",
    contentFeedback: isAcademia
      ? "Superb explanation of your NSF grant strategy. Highly structured teaching philosophy. Consider expanding on industry-academic partnerships."
      : "Strong technical breakdown of React state management and optimization. Excellent explanation of database index metrics. Well done!"
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Video size={14} className="animate-pulse text-red-500" /> Premium AI Video Intelligence
          </span>
          <h2 className="text-3xl font-extrabold text-white">AI Video Resume & Mock Interview</h2>
          <p className="text-text-secondary text-sm">Practice technical verbal audits tailored directly to your professional background.</p>
        </div>
        <button 
          onClick={onNavigateToJobs}
          className="text-xs text-text-secondary hover:text-white transition-colors hover:underline cursor-pointer bg-transparent border-none"
        >
          Back to Careers
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Webcam Recorder Interface */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-0 relative overflow-hidden border border-white/10 aspect-video bg-[#0c0d12] flex items-center justify-center rounded-2xl shadow-2xl">
            
            {/* Live Video Output */}
            {stream && (
              <>
                <style>{`
                  @keyframes scanline-anim {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                  }
                  .scanline-overlay {
                    background: linear-gradient(
                      rgba(18, 16, 16, 0) 50%, 
                      rgba(0, 0, 0, 0.25) 50%
                    ), linear-gradient(
                      90deg, 
                      rgba(255, 0, 0, 0.04), 
                      rgba(0, 255, 0, 0.01), 
                      rgba(0, 0, 255, 0.04)
                    );
                    background-size: 100% 4px, 6px 100%;
                  }
                  .cyberpunk-grid-overlay {
                    background-image: 
                      linear-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 240, 255, 0.08) 1px, transparent 1px);
                    background-size: 20px 20px;
                  }
                  .sweeping-bar {
                    animation: scanline-anim 6s linear infinite;
                  }
                `}</style>

                {/* Filter Selector Panel */}
                <div className="absolute top-4 right-4 z-30 flex bg-black/75 p-1 rounded-lg border border-white/10 gap-1 backdrop-blur-md">
                  {['normal', 'cyberpunk', 'holographic'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setVideoFilter(f)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded uppercase transition-colors border-none cursor-pointer ${videoFilter === f ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover transition-all duration-300 ${videoFilter === 'cyberpunk' ? 'brightness-90 contrast-125 saturate-150' : videoFilter === 'holographic' ? 'sepia-[0.15] brightness-95' : ''}`}
                />

                {/* Cyberpunk grid overlay */}
                {videoFilter === 'cyberpunk' && (
                  <div className="absolute inset-0 cyberpunk-grid-overlay pointer-events-none z-10 border border-primary/20"></div>
                )}

                {/* Holographic Scanlines overlay */}
                {videoFilter === 'holographic' && (
                  <div className="absolute inset-0 scanline-overlay pointer-events-none z-10">
                    <div className="w-full h-1.5 bg-primary/20 shadow-md shadow-primary/30 sweeping-bar absolute left-0 top-0"></div>
                  </div>
                )}
              </>
            )}

            {/* Setup View (Camera Off) */}
            {interviewState === 'setup' && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 flex flex-col items-center justify-center p-8 text-center">
                <div className="p-5 bg-white/5 border border-white/10 rounded-full text-text-secondary mb-6 hover:scale-110 transition-transform">
                  <VideoOff size={42} />
                </div>
                <h3 className="text-xl font-bold mb-2">Initialize AI Technical Interview</h3>
                <p className="text-text-secondary text-xs max-w-sm mb-6 leading-relaxed">
                  HireHub requires mic and camera authorization to display your live video feed, prompt questions, and render cognitive speech diagnostics.
                </p>
                {cameraPermission === 'denied' && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl mb-4 text-xs font-semibold">
                    <AlertCircle size={14} /> Camera access blocked. Please enable browser permissions.
                  </div>
                )}
                <button 
                  onClick={startCamera}
                  className="btn btn-primary px-6 py-3 text-sm flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Video size={16} /> Enable Camera & Audio
                </button>
              </div>
            )}

            {/* Warm-Up View (Camera Active, Pending Start) */}
            {interviewState === 'warm-up' && (
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> Live Camera Active
                  </span>
                </div>
                
                <div className="bg-black/75 border border-white/5 p-5 rounded-2xl max-w-md mx-auto text-center backdrop-blur-md">
                  <h4 className="font-extrabold text-sm mb-1 text-white">Camera Check Complete!</h4>
                  <p className="text-text-secondary text-[11px] mb-4">Make sure you are in a well-lit room. Your AI Technical Interview will consist of {questions.length} questions.</p>
                  <button 
                    onClick={startRecording}
                    className="btn btn-primary px-8 py-2.5 text-xs font-bold w-full flex items-center justify-center gap-2"
                  >
                    <Play size={12} fill="white" /> Begin Mock Interview
                  </button>
                </div>
                <div />
              </div>
            )}

            {/* Active Recording State */}
            {interviewState === 'recording' && (
              <div className="absolute inset-0 bg-black/10 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> RECORDING USER RESPONSES
                  </span>
                  <span className="px-3 py-1 bg-black/60 text-white border border-white/10 text-xs font-mono rounded-lg">
                    {formatTime(secondsElapsed)}
                  </span>
                </div>

                {/* Technical question prompt overlays */}
                <div className="w-full bg-black/75 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                  <span className="text-[10px] text-primary uppercase font-extrabold tracking-wider mb-1 block">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-relaxed mb-3">
                    {questions[currentQuestionIndex]}
                  </h4>
                  <div className="flex justify-end">
                    <button 
                      onClick={nextQuestion}
                      className="btn btn-primary py-1.5 px-4 text-[10px] font-bold flex items-center gap-1"
                    >
                      {currentQuestionIndex === questions.length - 1 ? "Complete Interview" : "Next Question"} 
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI analyzing loader */}
            {interviewState === 'analyzing' && (
              <div className="absolute inset-0 bg-[#0c0d12] flex flex-col items-center justify-center p-8 text-center z-20">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                  <Sparkles className="text-primary absolute" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Video & Speech Cadence</h3>
                <p className="text-text-secondary text-xs max-w-sm leading-relaxed">
                  Evaluating grammar, vocabulary keywords, speaking speed (WPM), and counting filler words. Rerouting credentials shortly...
                </p>
              </div>
            )}

            {/* Completed results indicator */}
            {interviewState === 'results' && (
              <div className="absolute inset-0 bg-[#0a0b10] flex flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-secondary/15 text-secondary border border-secondary/20 rounded-full mb-4">
                  <Award size={36} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Dossier Graded & Saved!</h3>
                <p className="text-xs text-text-secondary mb-5">Your speech data has been parsed and integrated into your Candidate Readiness Score.</p>
                <button 
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setInterviewState('setup');
                  }}
                  className="btn btn-secondary px-6 py-2 text-xs flex items-center gap-1.5"
                >
                  <RefreshCw size={12} /> Re-record Interview
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Dynamic Instruction Panels / AI Diagnostic Dashboard */}
        <div className="md:col-span-1">
          {interviewState !== 'results' ? (
            <div className="card p-6 border border-white/5 h-full flex flex-col justify-between space-y-6 bg-gradient-to-br from-white/5 to-transparent">
              <div>
                <h3 className="font-extrabold text-lg mb-3 text-white flex items-center gap-2">
                  <HelpCircle size={18} className="text-primary" /> Interview Blueprint
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  HireHub's AI Video Intelligence scans candidate speech patterns against required job profiles. Practicing boosts your matching metrics and prepares you for real-world academic defense or corporate rounds.
                </p>
                <div className="space-y-3.5 border-t border-white/5 pt-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Target Competencies</h4>
                      <p className="text-[10px] text-text-secondary">Speaks about technical frameworks ({isAcademia ? 'Academic Grants, Pedagogy' : 'React, SQL, NLP'}).</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Speech Speed Tuning</h4>
                      <p className="text-[10px] text-text-secondary">Keep an optimal speed between 110-150 words per minute.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Fillers Word Audits</h4>
                      <p className="text-[10px] text-text-secondary">Minimize conversational placeholders like "um", "like", and "so".</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                <Mic size={18} className="text-primary animate-pulse" />
                <span className="text-[10px] text-text-secondary leading-relaxed">
                  Authorization is secure. Streams are evaluated strictly inside your browser sandbox.
                </span>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Score Assessment Card */}
              <div className="card p-6 border-secondary/20 bg-gradient-to-br from-secondary/15 to-transparent text-center">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-secondary mb-4">AI Score Card</h3>
                <div className="w-24 h-24 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg shadow-secondary/10">
                  {simulatedResults.score}%
                </div>
                <h4 className="font-bold text-base mb-1">Credentials Deemed Competitive</h4>
                <p className="text-[11px] text-text-secondary">Your speaking parameters align heavily with prime HireHub requirements!</p>
              </div>

              {/* Timing metrics checklist */}
              <div className="card p-6 border-white/5 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Speech Diagnostic Logs</h3>
                
                <div className="space-y-3 text-xs border-b border-white/5 pb-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Cadence Speed:</span>
                    <span className="font-bold text-white">{simulatedResults.pacing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Session Duration:</span>
                    <span className="font-bold text-white">{simulatedResults.duration}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-text-secondary uppercase mb-2">Filler Word Diagnostic counts</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white/5 border border-white/5 rounded-lg">
                      <div className="text-xs text-text-secondary">"um"</div>
                      <div className="font-bold text-white">{simulatedResults.fillers.um}</div>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/5 rounded-lg">
                      <div className="text-xs text-text-secondary">"like"</div>
                      <div className="font-bold text-white">{simulatedResults.fillers.like}</div>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/5 rounded-lg">
                      <div className="text-xs text-text-secondary">"basically"</div>
                      <div className="font-bold text-white">{simulatedResults.fillers.basically}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text feedback box */}
              <div className="card p-6 border-white/5 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Constructive Feedback</h3>
                <div>
                  <h4 className="text-[10px] font-extrabold text-primary uppercase mb-1.5">Communication Quality</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{simulatedResults.communicationFeedback}</p>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <h4 className="text-[10px] font-extrabold text-secondary uppercase mb-1.5">Content Alignment</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{simulatedResults.contentFeedback}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
