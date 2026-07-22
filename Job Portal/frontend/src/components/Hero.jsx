import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-accent/20 blur-[100px] rounded-full -z-10"></div>
      
      <div className="container text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8"
        >
          <Sparkles size={16} />
          <span>AI-Powered Career Transformation</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Job Portal with <br />
          <span className="gradient-text">Skill Matching</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          Elevate uses advanced AI to analyze your skills, identify gaps, and match you with the perfect opportunities. Resume-to-job matching with 91%+ accuracy.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#resume-analyzer" className="btn btn-primary px-8 py-4 text-lg">
            Upload Your Resume
            <ArrowRight size={20} />
          </a>
          <a href="#job-list" className="btn btn-secondary px-8 py-4 text-lg">
            Explore Jobs
          </a>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="p-6 rounded-2xl glass border border-white/5 bg-white/5">
            <h3 className="text-3xl font-bold mb-1">91.2%</h3>
            <p className="text-text-secondary">AI Accuracy</p>
          </div>
          <div className="p-6 rounded-2xl glass border border-white/5 bg-white/5">
            <h3 className="text-3xl font-bold mb-1">50k+</h3>
            <p className="text-text-secondary">Open Positions</p>
          </div>
          <div className="p-6 rounded-2xl glass border border-white/5 bg-white/5">
            <h3 className="text-3xl font-bold mb-1">10k+</h3>
            <p className="text-text-secondary">Courses</p>
          </div>
          <div className="p-6 rounded-2xl glass border border-white/5 bg-white/5">
            <h3 className="text-3xl font-bold mb-1">200+</h3>
            <p className="text-text-secondary">Partner Companies</p>
          </div>
        </div>
      </div>
    </section>
  );
}
