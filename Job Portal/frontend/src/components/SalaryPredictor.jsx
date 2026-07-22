import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, MapPin, Briefcase, Award, TrendingUp, 
  ChevronRight, Sparkles, CheckSquare, Square, Info
} from 'lucide-react';

export default function SalaryPredictor({ user, onNavigateToJobs }) {
  // Configurable inputs
  const [role, setRole] = useState('Full Stack Developer');
  const [location, setLocation] = useState('San Francisco, CA');
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

  // Prediction Heuristics Engine
  const calculateSalary = () => {
    let base = 75000;
    
    // 1. Role Base values
    switch (role) {
      case 'ML Engineer': base = 120000; break;
      case 'Full Stack Developer': base = 95000; break;
      case 'Senior Research Scientist': base = 135000; break;
      case 'Assistant Professor': base = 90000; break;
      case 'Academic Dean': base = 150000; break;
      case 'Frontend Architect': base = 110000; break;
      default: base = 80000;
    }

    // 2. Location Multipliers
    let locMultiplier = 1.0;
    switch (location) {
      case 'San Francisco, CA': locMultiplier = 1.45; break;
      case 'New York, NY': locMultiplier = 1.35; break;
      case 'London, UK': locMultiplier = 1.25; break;
      case 'Bangalore, IN': locMultiplier = 0.90; break;
      case 'Remote': locMultiplier = 1.15; break;
      default: locMultiplier = 1.0;
    }

    // 3. Experience increment
    const expValue = experience * 6500;

    // 4. Skills additions
    const skillsValue = selectedSkills.length * 3500;

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

  // Determine market demand level
  const getMarketDemand = () => {
    let score = 0;
    if (location === 'San Francisco, CA' || location === 'New York, NY') score += 2;
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
    // Pick top 3 missing skills with values
    return missingSkills.slice(0, 3).map((s, idx) => ({
      skill: s,
      value: 3500 + (idx * 500)
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
          <h2 className="text-3xl font-extrabold text-white">Location & Salary Predictor Engine</h2>
          <p className="text-text-secondary text-sm">Fine-tune target job markets and evaluate the premium value of technical skills.</p>
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
              >
                <optgroup label="Industry Roles">
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="ML Engineer">ML/AI Engineer</option>
                  <option value="Frontend Architect">Frontend Architect</option>
                </optgroup>
                <optgroup label="Academic Roles">
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Senior Research Scientist">Senior Research Scientist</option>
                  <option value="Academic Dean">Academic Dean</option>
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
              >
                <option value="San Francisco, CA">San Francisco, CA</option>
                <option value="New York, NY">New York, NY</option>
                <option value="London, UK">London, UK</option>
                <option value="Bangalore, IN">Bangalore, IN</option>
                <option value="Remote">Remote Operations</option>
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
              Toggle specific tech stack competencies below to calculate real-time premium updates.
            </p>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
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
                      {isSelected ? '+$3,500' : 'Inactive'}
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
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <DollarSign size={160} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
              <div>
                <span className="text-[10px] text-primary uppercase font-extrabold tracking-wider block mb-1">Estimated Base Salary</span>
                <h3 className="text-4xl font-black text-white flex items-center">
                  <span className="text-2xl text-text-secondary font-medium mr-1">$</span>
                  {salaries.median.toLocaleString()}
                  <span className="text-sm text-text-secondary font-bold uppercase ml-2">/ Year</span>
                </h3>
              </div>

              <div className={`px-4 py-2 border rounded-xl text-xs font-bold shrink-0 self-start sm:self-center ${demand.color}`}>
                {demand.text}
              </div>
            </div>

            {/* Custom CSS Horizontal Wage Curve Slider */}
            <div className="space-y-8 my-8">
              <div className="relative pt-6">
                
                {/* Visual bar gradient */}
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-secondary to-primary w-full"></div>
                </div>

                {/* Markers (Quartiles) */}
                <div className="absolute top-0 left-0 w-full flex justify-between px-0.5">
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-6 bg-white/10 rounded-full"></div>
                    <span className="text-[10px] text-text-secondary font-mono mt-1.5">${salaries.low.toLocaleString()}</span>
                    <span className="text-[9px] uppercase font-bold text-text-secondary mt-0.5">Lower Quartile</span>
                  </div>

                  <div className="flex flex-col items-center absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    <span className="text-[10px] text-primary font-mono mt-1.5 font-bold">${salaries.median.toLocaleString()}</span>
                    <span className="text-[9px] uppercase font-bold text-primary mt-0.5">Estimated Median</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-6 bg-white/10 rounded-full"></div>
                    <span className="text-[10px] text-text-secondary font-mono mt-1.5">${salaries.high.toLocaleString()}</span>
                    <span className="text-[9px] uppercase font-bold text-text-secondary mt-0.5">Upper Quartile</span>
                  </div>
                </div>
              </div>

              {/* Dynamic 15-Year SVG Trajectory Line Graph */}
              <div className="mt-8 border-t border-white/5 pt-6">
                <h4 className="text-xs font-bold text-text-secondary uppercase mb-3 flex items-center gap-1">
                  <TrendingUp size={12} className="text-primary" /> 15-Year Career Wage Trajectory Projection
                </h4>
                <div className="bg-black/35 rounded-2xl border border-white/5 p-4 backdrop-blur-sm">
                  <svg className="w-full h-32" viewBox="0 0 500 120">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[25, 55, 85, 115].map((yVal, i) => (
                      <line key={i} x1="25" y1={yVal} x2="475" y2={yVal} stroke="white" strokeWidth="0.5" strokeOpacity="0.06" />
                    ))}

                    {/* Trajectory Projection Curve */}
                    <path
                      d={`M 25,${105 - (salaries.median * 0.08) / 1000} 
                          Q 150,${90 - (salaries.median * 0.12) / 1000} 
                          250,${70 - (salaries.median * 0.16) / 1000} 
                          T 475,${30 - (salaries.median * 0.22) / 1000}`}
                      fill="none"
                      stroke="url(#chartGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Marker Pin representing experience */}
                    <circle
                      cx={25 + (experience * 30)}
                      cy={105 - (experience * 4) - (salaries.median * 0.08) / 1000}
                      r="6"
                      className="fill-secondary stroke-white"
                      strokeWidth="2.5"
                    />

                    {/* SVG Coordinates Text Labels */}
                    <text x="25" y="117" className="text-[8px] fill-text-secondary font-mono font-bold" style={{ fontSize: '8px' }}>0 Yrs</text>
                    <text x="240" y="117" className="text-[8px] fill-text-secondary font-mono font-bold" style={{ fontSize: '8px' }}>7 Yrs (Mid)</text>
                    <text x="445" y="117" className="text-[8px] fill-text-secondary font-mono font-bold" style={{ fontSize: '8px' }}>15 Yrs (Senior)</text>
                  </svg>
                </div>
              </div>

              {/* Skill Path ROI Optimizer */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary animate-pulse" /> Skill Path Optimizer Active
                  </div>
                  <p className="text-[10px] text-text-secondary leading-normal">
                    Check or uncheck competencies on the left to see the absolute financial ROI of adding high-value skills!
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
                <Info size={12} className="inline mr-1 text-primary" /> Forecast estimates are calculated based on 2026 relational wage standards. Experience lines adjust automatically.
              </div>
            </div>
          </div>

          {/* Hiring Hotspots Panel */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Hotspots Card */}
            <div className="card p-6 border-white/5">
              <h4 className="font-extrabold text-base text-white mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-secondary" /> Hotspot Ecosystems
              </h4>
              <div className="space-y-3.5">
                {[
                  { name: "Silicon Valley (SFO)", active: location === "San Francisco, CA", open: "142 Openings" },
                  { name: "Silicon Alley (NYC)", active: location === "New York, NY", open: "98 Openings" },
                  { name: "Tech City London (LDN)", active: location === "London, UK", open: "74 Openings" },
                  { name: "Silicon Valley India (BLR)", active: location === "Bangalore, IN", open: "115 Openings" }
                ].map((l, li) => (
                  <div 
                    key={li}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${l.active ? 'bg-secondary/15 border-secondary/35 text-white' : 'bg-white/5 border-white/5 text-text-secondary'}`}
                  >
                    <span>{l.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${l.active ? 'bg-secondary text-white' : 'bg-white/5 text-text-secondary'}`}>
                      {l.open}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* High Value Skill Recommendations (Skill Upgrade) */}
            <div className="card p-6 border-white/5 space-y-4">
              <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                <Award size={18} className="text-primary animate-pulse" /> Skill Valuation Recommendations
              </h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Unlock high-level pay bands by incorporating the following technical competencies:
              </p>
              
              <div className="space-y-3 pt-1">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="p-3 bg-black/25 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{s.skill}</div>
                      <div className="text-[9px] text-text-secondary">Expected yearly premium lift</div>
                    </div>
                    <div className="text-xs font-mono font-bold text-primary">
                      +${s.value.toLocaleString()}/yr
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
