import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IndianRupee, MapPin, Briefcase, Award, TrendingUp,
  ChevronRight, Sparkles, CheckSquare, Square, Info
} from 'lucide-react';

export default function SalaryPredictor({ user, onNavigateToJobs }) {
  // Configurable inputs
  const [role, setRole] = useState('Full Stack Developer');
  const [location, setLocation] = useState('Bangalore, IN');
  const [experience, setExperience] = useState(3);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const allSkillsVocabulary = [
    "React", "Node.js", "Python", "Machine Learning", "Academic Research",
    "Pedagogy", "Grant Writing", "PostgreSQL", "AWS", "TypeScript",
    "TensorFlow", "PyTorch", "NLP", "Framer Motion", "JavaScript"
  ];

  // Sync user's skills on mount
  useEffect(() => {
    if (user && user.skills) {
      setSelectedSkills(user.skills);
    } else {
      setSelectedSkills(["React", "Node.js", "JavaScript"]);
    }

    // Set a sensible default role based on academic/industry
    if (user?.role === 'academia') {
      setRole('Assistant Professor');
    } else {
      setRole('Full Stack Developer');
    }
  }, [user]);

  // Handle skill toggle
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Prediction Heuristics Engine (In Indian Rupees ₹)
  const calculateSalary = () => {
    let base = 800000; // 8 LPA base

    // 1. Role Base values
    switch (role) {
      case 'ML Engineer': base = 1600000; break; // 16 LPA
      case 'Full Stack Developer': base = 1200000; break; // 12 LPA
      case 'Senior Research Scientist': base = 2000000; break; // 20 LPA
      case 'Assistant Professor': base = 1000000; break; // 10 LPA
      case 'Academic Dean': base = 2400000; break; // 24 LPA
      case 'Frontend Architect': base = 1800000; break; // 18 LPA
      default: base = 900000;
    }

    // 2. Location Multipliers
    let locMultiplier = 1.0;
    switch (location) {
      case 'Bangalore, IN': locMultiplier = 1.35; break;
      case 'Mumbai / Pune, IN': locMultiplier = 1.25; break;
      case 'Delhi NCR, IN': locMultiplier = 1.20; break;
      case 'Hyderabad, IN': locMultiplier = 1.15; break;
      case 'Remote Operations': locMultiplier = 1.10; break;
      default: locMultiplier = 1.0;
    }

    // 3. Experience increment
    const expValue = experience * 120000; // 1.2L per year exp

    // 4. Skills additions
    const skillsValue = selectedSkills.length * 60000; // 60k per skill

    const estimatedMedian = Math.round((base * locMultiplier) + expValue + skillsValue);
    const lowEnd = Math.round(estimatedMedian * 0.82);
    const highEnd = Math.round(estimatedMedian * 1.18);

    return {
      low: lowEnd,
      median: estimatedMedian,
      high: highEnd
    };
  };

  const salaries = calculateSalary();

  // Format number to INR format (LPA)
  const formatINR = (val) => {
    const lakhs = (val / 100000).toFixed(2);
    return `₹${lakhs} LPA (₹${val.toLocaleString('en-IN')})`;
  };

  const formatShortINR = (val) => {
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  // Determine market demand level
  const getMarketDemand = () => {
    let score = 0;
    if (location === 'Bangalore, IN' || location === 'Mumbai / Pune, IN') score += 2;
    if (role === 'ML Engineer' || role === 'Senior Research Scientist' || role === 'Frontend Architect') score += 2;
    if (selectedSkills.includes('Machine Learning') || selectedSkills.includes('PyTorch') || selectedSkills.includes('TypeScript')) score += 1;

    if (score >= 4) return { text: "Explosive Demand 🔥", color: "text-red-400 bg-red-500/10 border-red-500/20" };
    if (score >= 2) return { text: "High Demand 📈", color: "text-primary bg-primary/10 border-primary/20" };
    return { text: "Moderate Demand ⚖️", color: "text-secondary bg-secondary/10 border-secondary/20" };
  };

  const demand = getMarketDemand();

  // Suggesting valuable missing skills
  const getSuggestions = () => {
    const missingSkills = allSkillsVocabulary.filter(s => !selectedSkills.includes(s));
    return missingSkills.slice(0, 3).map((s, idx) => ({
      skill: s,
      value: 60000 + (idx * 15000)
    }));
  };

  const suggestions = getSuggestions();

  return (
    <div className="container py-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-secondary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <TrendingUp size={14} /> Intelligence Market Forecasts
          </span>
          <h2 className="text-3xl font-extrabold text-white">Location & Salary Predictor Engine (₹ INR)</h2>
          <p className="text-text-secondary text-sm">Fine-tune target job markets and evaluate the premium value of technical skills in Rupees.</p>
        </div>
        <button
          onClick={onNavigateToJobs}
          className="text-xs text-text-secondary hover:text-white transition-colors hover:underline cursor-pointer bg-transparent border-none"
        >
          Back to Careers
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {/* Left Side: Filter Form & Skills Selector */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 border-white/5 bg-[#0d0e14] space-y-6">
            <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-3">Prediction Parameters</h3>

            {/* Role dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input w-full py-2.5 bg-black/40 border-white/10 text-white rounded-xl text-sm"
                style={{ backgroundColor: '#0f1017', color: '#ffffff' }}
              >
                <optgroup label="Industry Roles" style={{ backgroundColor: '#0f1017', color: '#94a3b8' }}>
                  <option value="Full Stack Developer" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Full Stack Developer</option>
                  <option value="ML Engineer" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>ML/AI Engineer</option>
                  <option value="Frontend Architect" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Frontend Architect</option>
                </optgroup>
                <optgroup label="Academic Roles" style={{ backgroundColor: '#0f1017', color: '#94a3b8' }}>
                  <option value="Assistant Professor" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Assistant Professor</option>
                  <option value="Senior Research Scientist" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Senior Research Scientist</option>
                  <option value="Academic Dean" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Academic Dean</option>
                </optgroup>
              </select>
            </div>

            {/* Location dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Preferred Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input w-full py-2.5 bg-black/40 border-white/10 text-white rounded-xl text-sm"
                style={{ backgroundColor: '#0f1017', color: '#ffffff' }}
              >
                <option value="Bangalore, IN" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Bangalore, IN</option>
                <option value="Mumbai / Pune, IN" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Mumbai / Pune, IN</option>
                <option value="Delhi NCR, IN" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Delhi NCR, IN</option>
                <option value="Hyderabad, IN" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Hyderabad, IN</option>
                <option value="Remote Operations" style={{ backgroundColor: '#0f1017', color: '#ffffff' }}>Remote Operations</option>
              </select>
            </div>

            {/* Experience Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase text-text-secondary">
                <label>Professional Experience</label>
                <span className="text-primary font-mono">{experience} Years</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={experience}
                onChange={(e) => setExperience(parseInt(e.target.value))}
                className="w-full accent-primary h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                <span>Entry</span>
                <span>Mid-Level</span>
                <span>Architect</span>
              </div>
            </div>
          </div>

          {/* Interactive Skills checklist */}
          <div className="card p-6 border-white/5 bg-[#0d0e14]">
            <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-3 mb-4">Competency Checklist</h3>
            <p className="text-[11px] text-text-secondary leading-relaxed mb-4">
              Toggle technical competencies to compute real-time salary lift in Rupees (₹).
            </p>
            <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
              {allSkillsVocabulary.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <div
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${isSelected ? 'bg-primary/5 border-primary/30 text-white' : 'bg-black/20 border-white/5 text-text-secondary hover:border-white/20'}`}
                  >
                    <span>{skill}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-primary font-bold' : 'text-text-secondary'}`}>
                      {isSelected ? '+₹60,000/yr' : 'Inactive'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Estimated Compensation Charts & Diagnostics */}
        <div className="md:col-span-2 space-y-6">

          {/* Estimated Salary Scorecard */}
          <div className="card p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
              <div>
                <span className="text-[10px] text-primary uppercase font-extrabold tracking-wider block mb-1">Estimated Base Salary (Rupees)</span>
                <h3 className="text-3xl font-black text-white flex items-center gap-1 flex-wrap">
                  <span className="text-2xl text-emerald-400 font-bold">₹</span>
                  <span>{(salaries.median / 100000).toFixed(2)} LPA</span>
                  <span className="text-sm text-text-secondary font-semibold">({`₹${salaries.median.toLocaleString('en-IN')}`} / yr)</span>
                </h3>
              </div>

              <div className={`px-4 py-2 border rounded-xl text-xs font-bold shrink-0 self-start sm:self-center ${demand.color}`}>
                {demand.text}
              </div>
            </div>

            {/* Horizontal Wage Curve Slider removed for cleaner UI */}

            {/* Skill Path ROI Optimizer */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary animate-pulse" /> Skill Path Optimizer Active
                </div>
                <p className="text-[10px] text-text-secondary leading-normal">
                  Check or uncheck competencies on the left to see the absolute financial ROI in Rupees (₹)!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const topMissing = suggestions[0]?.skill;
                  if (topMissing) {
                    toggleSkill(topMissing);
                  }
                }}
                disabled={suggestions.length === 0}
                className="btn btn-primary py-2 px-4 text-[10px] font-bold shrink-0 flex items-center gap-1"
              >
                Apply ROI Boost <ChevronRight size={10} />
              </button>
            </div>

            <div className="pt-2 text-center text-xs text-text-secondary leading-relaxed max-w-lg mx-auto">
              <Info size={12} className="inline mr-1 text-primary" /> Forecast estimates are calculated in Indian Rupees (₹ INR) based on 2026 relational market standards.
            </div>
          </div>
        </div>

        {/* High Value Skill Recommendations (Skill Upgrade) */}
        <div className="card p-6 border-white/5 space-y-4">
          <h4 className="font-extrabold text-base text-white flex items-center gap-2">
            <Award size={18} className="text-primary animate-pulse" /> Skill Valuation Recommendations (₹ INR)
          </h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Unlock higher pay bands in Indian Rupees by incorporating the following technical competencies:
          </p>

          <div className="space-y-3 pt-1">
            {suggestions.map((s, idx) => (
              <div key={idx} className="p-3 bg-black/25 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{s.skill}</div>
                  <div className="text-[9px] text-text-secondary">Expected yearly premium lift</div>
                </div>
                <div className="text-xs font-mono font-bold text-primary">
                  +₹{s.value.toLocaleString('en-IN')}/yr
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>

  );
}
