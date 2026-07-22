import React from 'react';
import { Briefcase, Bell, Search, LogOut, Compass, Sparkles, FileText, Video, TrendingUp, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onLogout, setIsAuthOpen, currentView, onSetView }) {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mx-6 my-4">
      <div className="container flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2 font-bold text-2xl tracking-tight cursor-pointer"
          onClick={() => onSetView('landing')}
        >
          <div className="bg-primary p-2 rounded-lg">
            <Briefcase className="text-white" size={24} />
          </div>
          <span className="gradient-text text-white font-extrabold">HireHub</span>
        </div>
        
        {/* Main Navigation Options */}
        <div className="hidden xl:flex items-center gap-6 font-semibold text-text-secondary text-xs">
          <button 
            onClick={() => onSetView('landing')}
            className={`hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold ${currentView === 'landing' ? 'text-white border-b-2 border-primary pb-0.5' : 'text-text-secondary'}`}
          >
            Find Jobs
          </button>
          
          <button 
            onClick={() => onSetView('resume-analyzer')}
            className={`hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold flex items-center gap-1 ${currentView === 'resume-analyzer' ? 'text-white border-b-2 border-primary pb-0.5' : 'text-text-secondary'}`}
          >
            <FileText size={14} /> Resume Analyzer
          </button>

          <button 
            onClick={() => onSetView('dashboard')}
            className={`hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold flex items-center gap-1 ${currentView === 'dashboard' ? 'text-white border-b-2 border-primary pb-0.5' : 'text-text-secondary'}`}
          >
            <Compass size={14} /> Command Center
          </button>

          <button 
            onClick={() => onSetView('chatbot')}
            className={`hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold flex items-center gap-1 ${currentView === 'chatbot' ? 'text-white border-b-2 border-primary pb-0.5' : 'text-text-secondary'}`}
          >
            <Sparkles size={14} /> Career AI Chat
          </button>

          <button 
            onClick={() => onSetView('interview')}
            className={`hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold flex items-center gap-1 ${currentView === 'interview' ? 'text-white border-b-2 border-primary pb-0.5' : 'text-text-secondary'}`}
          >
            <Video size={14} /> Video Interview
          </button>

          <button 
            onClick={() => onSetView('predictor')}
            className={`hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold flex items-center gap-1 ${currentView === 'predictor' ? 'text-white border-b-2 border-primary pb-0.5' : 'text-text-secondary'}`}
          >
            <TrendingUp size={14} /> Salary Forecast
          </button>

          <button 
            onClick={() => onSetView('blockchain')}
            className={`hover:text-white transition-colors border-none bg-transparent cursor-pointer font-bold flex items-center gap-1 ${currentView === 'blockchain' ? 'text-white border-b-2 border-primary pb-0.5' : 'text-text-secondary'}`}
          >
            <ShieldCheck size={14} /> Blockchain Ledger
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
            <Search size={20} className="text-text-secondary" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative hidden sm:block">
            <Bell size={20} className="text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div 
                className="text-right hidden sm:block cursor-pointer"
                onClick={() => onSetView('dashboard')}
              >
                <div className="text-white font-semibold text-sm hover:underline">{user.name}</div>
                <div className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">
                  {user.role === 'academia' ? 'Academia' : 'Industry'}
                </div>
              </div>
              
              <div 
                onClick={() => onSetView('dashboard')}
                className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center cursor-pointer overflow-hidden font-bold text-primary uppercase shadow-inner hover:scale-105 transition-transform"
              >
                {user.name.charAt(0)}
              </div>
              
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-colors text-text-secondary"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="btn btn-primary text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-primary/20"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
