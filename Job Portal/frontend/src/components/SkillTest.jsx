import React, { useState } from 'react';
import { apiUrl } from '../api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, XCircle, Loader2, ArrowRight, HelpCircle, GraduationCap } from 'lucide-react';

const QUIZZES = {
  react: {
    title: "React & Web Architecture",
    skill: "React",
    questions: [
      {
        q: "Which React 19 hook allows developers to render optimistic state updates during async transactions?",
        options: ["useOptimistic", "useTransition", "useFormStatus"],
        answer: 0
      },
      {
        q: "What dependency array configuration executes a useEffect hook on EVERY single component render?",
        options: ["Omitted entirely", "An empty array []", "An array with variables [state]"],
        answer: 0
      },
      {
        q: "What does HMR stand for in Vite/React development workflows?",
        options: ["Hot Module Replacement", "Hyper Mode Router", "Host Management Register"],
        answer: 0
      }
    ]
  },
  python: {
    title: "Python & Data Science Foundations",
    skill: "Python",
    questions: [
      {
        q: "Which data structure in standard Python is mutable and ordered?",
        options: ["List", "Tuple", "Set"],
        answer: 0
      },
      {
        q: "Which library is the industry standard for reading, cleaning, and manipulating Data Frames?",
        options: ["Pandas", "NumPy", "TensorFlow"],
        answer: 0
      },
      {
        q: "How do you square each item in a list comprehension?",
        options: ["[x**2 for x in items]", "[x^2 for x in items]", "items.map(x => x*x)"],
        answer: 0
      }
    ]
  },
  ml: {
    title: "Machine Learning & AI Modeling",
    skill: "Machine Learning",
    questions: [
      {
        q: "What classification does a K-Means algorithm fall under?",
        options: ["Unsupervised Clustering", "Supervised Classification", "Reinforcement Learning"],
        answer: 0
      },
      {
        q: "Which mathematical framework uses gradients to adjust neural network weights during training?",
        options: ["Backpropagation & Gradient Descent", "Linear Interpolation", "Cosine Similarity"],
        answer: 0
      },
      {
        q: "Which regularization method penalizes model weights based on their absolute values (L1 penalty)?",
        options: ["L1 Lasso Regularization", "L2 Ridge Regularization", "ElasticNet"],
        answer: 0
      }
    ]
  }
};

export default function SkillTest({ user, onNavigateToJobs, onSkillAdded }) {
  const [activeQuizKey, setActiveQuizKey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState('select'); // select, active, result, saving
  const [errorMsg, setErrorMsg] = useState('');

  const activeQuiz = QUIZZES[activeQuizKey];

  const handleStart = (key) => {
    setActiveQuizKey(key);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setErrorMsg('');
    setQuizState('active');
  };

  const handleOptionSelect = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleNext = () => {
    // Check answer
    if (selectedOptionIndex === activeQuiz.questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }

    // Go next
    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      // Finished! Evaluate passing score (at least 2/3 correct)
      const finalScore = score + (selectedOptionIndex === activeQuiz.questions[currentQuestionIndex].answer ? 1 : 0);
      const passed = finalScore >= 2;

      if (passed) {
        saveEarnedSkill(activeQuiz.skill, finalScore);
      } else {
        setScore(finalScore);
        setQuizState('result');
      }
    }
  };

  const saveEarnedSkill = (skillName, finalScore) => {
    setQuizState('saving');
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg("Session expired. Skill could not be saved.");
      setQuizState('result');
      return;
    }

    fetch(apiUrl('/api/auth/add-skill'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ skill: skillName })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update skills');
        return data;
      })
      .then((data) => {
        setScore(finalScore);
        onSkillAdded(data.skills); // Sync state in parent App
        setQuizState('result');
      })
      .catch((err) => {
        console.error('Error saving earned skill:', err);
        setErrorMsg('Error synchronizing skill to database, but you passed!');
        setScore(finalScore);
        setQuizState('result');
      });
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="card border border-white/10 p-8 relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {/* 1. SELECT QUIZ STATE */}
          {quizState === 'select' && (
            <motion.div 
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="p-4 bg-primary/10 rounded-full inline-flex text-primary mb-4">
                <GraduationCap size={40} />
              </div>
              <h3 className="text-3xl font-extrabold mb-2">HireHub Skill Credentials</h3>
              <p className="text-text-secondary mb-8">Pass a 3-question credentials test to verify your skills. Verified credentials instantly sync with your profile and boost your job matching percentages!</p>

              <div className="grid gap-4 text-left">
                {Object.keys(QUIZZES).map((key) => {
                  const q = QUIZZES[key];
                  const hasSkill = user && user.skills && user.skills.some(s => s.toLowerCase() === q.skill.toLowerCase());
                  
                  return (
                    <div 
                      key={key} 
                      className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${hasSkill ? 'border-secondary/20 bg-secondary/5' : 'border-white/5 bg-white/5 hover:border-primary/30'}`}
                    >
                      <div>
                        <h4 className="font-bold text-lg text-white">{q.title}</h4>
                        <p className="text-xs text-text-secondary mt-1"> Topic Credential: <strong>{q.skill}</strong></p>
                      </div>
                      
                      {hasSkill ? (
                        <span className="px-3.5 py-1.5 bg-secondary/15 text-secondary text-xs font-bold rounded-full border border-secondary/20 flex items-center gap-1">
                          ✓ Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStart(key)}
                          className="btn btn-primary py-2 px-4 text-xs font-bold"
                        >
                          Start Test
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2. ACTIVE QUIZ STATE */}
          {quizState === 'active' && activeQuiz && (
            <motion.div 
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Quiz Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">{activeQuiz.title}</span>
                  <h4 className="font-extrabold text-xl text-white">Question {currentQuestionIndex + 1} of 3</h4>
                </div>
                <button 
                  onClick={() => setQuizState('select')}
                  className="text-xs text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Question Text */}
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-6">
                <p className="text-lg font-semibold text-white leading-relaxed">
                  {activeQuiz.questions[currentQuestionIndex].q}
                </p>
              </div>

              {/* Options list */}
              <div className="space-y-3">
                {activeQuiz.questions[currentQuestionIndex].options.map((opt, oi) => {
                  const isSelected = selectedOptionIndex === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => handleOptionSelect(oi)}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${isSelected ? 'bg-primary/10 border-primary text-white' : 'bg-black/20 border-white/5 text-text-secondary hover:bg-white/5'}`}
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-xs text-text-secondary mr-3">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Control panel */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleNext}
                  disabled={selectedOptionIndex === null}
                  className="btn btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-50"
                >
                  {currentQuestionIndex + 1 < activeQuiz.questions.length ? "Next Question" : "Complete Test"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. SAVING PROCESS STATE */}
          {quizState === 'saving' && (
            <motion.div 
              key="saving"
              className="py-16 text-center flex flex-col items-center justify-center"
            >
              <Loader2 size={54} className="text-primary animate-spin mb-4" />
              <h4 className="text-xl font-bold mb-2">Syncing Skill Credential</h4>
              <p className="text-text-secondary text-sm">
                Authenticating quiz score and writing verified skill badge directly to your HireHub database profile...
              </p>
            </motion.div>
          )}

          {/* 4. RESULT STATE */}
          {quizState === 'result' && activeQuiz && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              {score >= 2 ? (
                <>
                  <div className="p-4 bg-secondary/10 text-secondary border border-secondary/20 rounded-full inline-flex mb-4 animate-bounce">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-2">Test Passed! 🎉</h3>
                  <p className="text-lg text-text-secondary mb-1">
                    You scored <strong className="text-white">{score} out of 3</strong> correct!
                  </p>
                  <p className="text-sm text-secondary font-bold mb-8">
                    Skill Credential <strong>"{activeQuiz.skill}"</strong> has been successfully synced to your profile!
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full inline-flex mb-4">
                    <XCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-2">Test Attempt Incomplete</h3>
                  <p className="text-lg text-text-secondary mb-1">
                    You scored <strong className="text-white">{score} out of 3</strong> correct.
                  </p>
                  <p className="text-sm text-red-400 font-semibold mb-8">
                    A minimum score of 2/3 (66%) is required to earn the credential.
                  </p>
                </>
              )}

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <button
                  onClick={() => setQuizState('select')}
                  className="btn btn-secondary w-full"
                >
                  Back to Assessments
                </button>
                {score >= 2 ? (
                  <button
                    onClick={onNavigateToJobs}
                    className="btn btn-primary w-full"
                  >
                    View Job Matches
                  </button>
                ) : (
                  <button
                    onClick={() => handleStart(activeQuizKey)}
                    className="btn btn-primary w-full"
                  >
                    Retry Assessment
                  </button>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
