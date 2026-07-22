import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, MessageSquare, Compass, Terminal, Award } from 'lucide-react';

export default function CareerChatbot({ user, onNavigateToJobs }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Welcome to HireHub AI Career Assistant! 🧠✨\n\nI can analyze your parsed skills to recommend the perfect job match, give you tailored technical interview prep questions, or provide ATS formatting tips for your CV.\n\nWhat can I help you with today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputText('');

    // Generate Bot response with small delay to simulate processing
    setTimeout(() => {
      let botResponse = "";
      const cleaned = text.toLowerCase();

      if (cleaned.includes('which job suits me') || cleaned.includes('recommend') || cleaned.includes('suit')) {
        if (!user || !user.skills || user.skills.length === 0) {
          botResponse = "I'd love to match you! However, you haven't uploaded a resume yet. 📄\n\nNavigate to the **Resume Analyzer** tab, upload a PDF resume, and I'll immediately parse your skills to suggest matching roles!";
        } else {
          // Mock recommending based on their role/skills
          const skillsList = user.skills.join(', ');
          if (user.role === 'academia') {
            botResponse = `Based on your academic CV skills (**${skillsList}**), your optimal matches are:\n\n1. 🎓 **Assistant Professor of Computer Science** at *State University of Technology* (94% Match Score)\n2. 🔬 **Senior Research Scientist** at *Global AI Institute* (87% Match Score)\n\nI highly recommend studying **Academic Research & Grant Writing** to secure tenure-track offers!`;
          } else {
            botResponse = `Based on your developer CV skills (**${skillsList}**), your optimal matches are:\n\n1. 💻 **Senior Full Stack Developer** at *TechNova Solutions* (95% Match Score)\n2. 🎨 **Frontend Architect** at *DesignCo* (78% Match Score)\n\nI suggest practicing **Node.js & PostgreSQL** to lock in your backend skills!`;
          }
        }
      } else if (cleaned.includes('react') || cleaned.includes('frontend') || cleaned.includes('web')) {
        botResponse = `Here is your **React & Frontend Interview Prep Dossier** 🚀:\n\n**Q1: How does the Virtual DOM optimize page renders?**\n*A:* React keeps a lightweight representation of the UI in memory. On state change, it creates a new virtual tree, diffs it against the old tree, and bats optimized edits to the real DOM (Reconciliation).\n\n**Q2: Explain the hook dependencies array in useEffect.**\n*A:* If omitted, the effect runs on every render. If empty \`[]\`, it runs once on mount. If populated \`[dep1]\`, the effect triggers only when the listed dependencies change state.\n\n**Q3: What is HMR (Hot Module Replacement)?**\n*A:* It exchanges, adds, or removes modules while an application is running, without a full page reload, preserving React state during development.`;
      } else if (cleaned.includes('python') || cleaned.includes('ml') || cleaned.includes('machine learning') || cleaned.includes('ai')) {
        botResponse = `Here is your **AI & Machine Learning Interview Prep Dossier** 🧠:\n\n**Q1: What is the difference between supervised and unsupervised learning?**\n*A:* Supervised learning utilizes labeled datasets (input-output pairs) to train algorithms for regression or classification. Unsupervised learning scans unlabeled datasets to detect hidden structures or clustering.\n\n**Q2: Explain overfitting and how to prevent it.**\n*A:* Overfitting happens when a model learns the training data's noise rather than general patterns, failing on new test data. Prevent it via L1/L2 regularization, dropout nodes, early stopping, or expanding the dataset.\n\n**Q3: How does a Transformer attention mechanism work?**\n*A:* It computes a dynamic matching score between Query, Key, and Value vectors, allowing models to focus selectively on contextual words in a sequence regardless of distance.`;
      } else if (cleaned.includes('improve my cv') || cleaned.includes('resume') || cleaned.includes('cv') || cleaned.includes('ats')) {
        botResponse = `Here is your **HireHub ATS Resume Audit Check** 📊:\n\n1. **Quantify Your Impact:** Instead of writing *"Responsible for React coding"*, write *"Engineered 12 React component libraries, boosting page loading speeds by 35%"*.\n2. **Clear Skill Columns:** Place technical skills in clear comma-separated blocks. ATS parsers read clean strings better than complicated styled graphics.\n3. **Add Projects & Publications:** If applying to tech roles, link your GitHub projects. If applying to academia, list your top peer-reviewed journal papers!`;
      } else {
        botResponse = `That is an excellent career goal! 🌟\n\nOn HireHub, we bridge the gap between skills and opportunities. Here are some quick starting guides you can ask me:\n\n- *"Which job suits me?"* to run matching algorithms.\n- *"Show me React interview prep"* for frontend technical audits.\n- *"How can I improve my CV?"* for ATS parsing tips.\n\nOr click the tabs above to explore job openings directly!`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 850);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="card flex flex-col h-[650px] relative overflow-hidden border border-white/10 p-0">
        
        {/* Chat Header */}
        <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 text-primary rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">HireHub Career AI</h3>
              <p className="text-xs text-secondary font-semibold">Active & Online • Dynamic Guidance</p>
            </div>
          </div>
          <button 
            onClick={onNavigateToJobs}
            className="text-xs text-text-secondary hover:text-white transition-colors hover:underline cursor-pointer bg-transparent border-none"
          >
            Back to Positions
          </button>
        </div>

        {/* Suggestion Shortcuts */}
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { text: "🔍 Which job suits me?", value: "Which job suits me?" },
            { text: "💻 React Interview Prep", value: "Show me React interview prep" },
            { text: "🧠 Python & ML Prep", value: "Show me Python interview prep" },
            { text: "📄 How to improve my CV?", value: "How can I improve my CV?" }
          ].map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.value)}
              style={{
                padding: '0.4rem 0.875rem', borderRadius: '9999px',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s',
                display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap'
              }}
            >
              {s.text}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${isBot ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-secondary/20 text-secondary border border-secondary/20'}`}>
                      {isBot ? <Sparkles size={14} /> : <User size={14} />}
                    </div>

                    {/* Speech Bubble */}
                    <div 
                      className={`p-4 rounded-2xl text-sm ${isBot ? 'bg-white/5 border border-white/5 text-text-primary rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}
                      style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                    >
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }} 
          style={{ padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <input
            type="text"
            placeholder="Type a career or interview question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            type="submit" 
            style={{ padding: '0.75rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
}
