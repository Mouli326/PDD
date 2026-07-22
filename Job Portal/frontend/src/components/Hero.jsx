import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Upload, Briefcase } from 'lucide-react';

export default function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '4rem', paddingBottom: '3rem' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'rgba(168,85,247,0.18)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }}></div>
      
      <div className="container" style={{ textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.75rem' }}
        >
          <Sparkles size={16} />
          <span>AI-Powered Career Transformation</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: 'clamp(2.25rem, 6vw, 4.25rem)', fontWeight: 900, marginBottom: '1.25rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}
        >
          Smart Career Portal with <br />
          <span className="gradient-text">Skill Gap Intelligence</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}
        >
          HireHub matches your resume against academic and tech job profiles, detects skill gaps, recommends learning, and forecasts salaries with 91%+ accuracy.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', itemsCenter: 'center', justifyContent: 'center', gap: '1rem' }}
        >
          <a 
            href="#resume-analyzer"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '0.875rem 2rem', borderRadius: '0.75rem',
              fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: 'var(--primary)', color: 'white', textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(168, 85, 247, 0.4)', transition: 'all 0.2s'
            }}
          >
            <Upload size={18} /> Upload PDF Resume <ArrowRight size={18} />
          </a>
          <a 
            href="#job-list"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '0.875rem 2rem', borderRadius: '0.75rem',
              fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', color: 'white', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s'
            }}
          >
            <Briefcase size={18} /> Explore Job Matches
          </a>
        </motion.div>

        <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { stat: '91.2%', label: 'AI Accuracy' },
            { stat: '50k+',  label: 'Open Positions' },
            { stat: '10k+',  label: 'Curated Courses' },
            { stat: '200+',  label: 'Partner Orgs' },
          ].map(({ stat, label }) => (
            <div key={label} style={{ padding: '1.25rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 4px', color: 'white' }}>{stat}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
