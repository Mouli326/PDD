import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import JobList from './components/JobList';
import SkillAnalysis from './components/SkillAnalysis';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';
import CareerChatbot from './components/CareerChatbot';
import MockInterview from './components/MockInterview';
import SalaryPredictor from './components/SalaryPredictor';
import BlockchainResume from './components/BlockchainResume';
import LoginPage from './components/LoginPage';

function App() {
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [activeJobId, setActiveJobId] = useState(1);
  
  // Auth State
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'dashboard'
  const [authLoading, setAuthLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Token validation failed');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setUploadedFileName(data.resume_name || '');
        setAuthLoading(false);
      })
      .catch(err => {
        console.error('Session loading error:', err);
        localStorage.removeItem('token');
        setAuthLoading(false);
      });
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setUploadedFileName(userData.resume_name || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUploadedFileName('');
    setCurrentView('landing');
  };

  const handleUploadSuccess = (fileName, parsedSkills) => {
    setUploadedFileName(fileName);
    if (user) {
      setUser(prev => ({
        ...prev,
        resume_name: fileName,
        skills: parsedSkills
      }));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex items-center justify-center flex-col gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-text-secondary text-sm">Synchronizing Secure Career Environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar 
          user={user} 
          onLogout={handleLogout}
          setIsAuthOpen={setIsAuthOpen}
          currentView={currentView}
          onSetView={setCurrentView}
        />
        
        <main>
          {!user && currentView !== 'landing' && currentView !== 'resume-analyzer' ? (
            <LoginPage onAuthSuccess={handleAuthSuccess} />
          ) : (
            <>
              {currentView === 'landing' && (
                <>
                  <Hero />
                  <ResumeAnalyzer 
                    uploadedFileName={uploadedFileName} 
                    onUploadSuccess={handleUploadSuccess}
                  />
                  <JobList 
                    uploadedFileName={uploadedFileName} 
                    activeJobId={activeJobId}
                    setActiveJobId={setActiveJobId}
                    user={user}
                  />
                  <SkillAnalysis 
                    activeJobId={activeJobId} 
                    userSkills={user ? user.skills : null}
                  />
                </>
              )}

              {currentView === 'resume-analyzer' && (
                <div className="py-12">
                  <ResumeAnalyzer 
                    uploadedFileName={uploadedFileName} 
                    onUploadSuccess={handleUploadSuccess}
                  />
                </div>
              )}

              {currentView === 'dashboard' && (
                <UserDashboard 
                  user={user}
                  uploadedFileName={uploadedFileName}
                  onBackToJobs={() => setCurrentView('landing')}
                  onUploadSuccess={handleUploadSuccess}
                  onNavigateToTab={setCurrentView}
                />
              )}

              {currentView === 'chatbot' && (
                <CareerChatbot 
                  user={user} 
                  onNavigateToJobs={() => setCurrentView('landing')} 
                />
              )}

              {currentView === 'interview' && (
                <MockInterview 
                  user={user} 
                  onNavigateToJobs={() => setCurrentView('landing')}
                  onVideoCompleted={() => {
                    localStorage.setItem('interviewCompleted', 'true');
                    // Force React re-render to update readiness
                    setUser(prev => ({ ...prev }));
                  }}
                />
              )}

              {currentView === 'predictor' && (
                <SalaryPredictor 
                  user={user} 
                  onNavigateToJobs={() => setCurrentView('landing')} 
                />
              )}

              {currentView === 'blockchain' && (
                <BlockchainResume 
                  user={user}
                  uploadedFileName={uploadedFileName}
                  onMintedSuccess={() => {
                    localStorage.setItem('blockchainMinted', 'true');
                    // Force React re-render to update readiness
                    setUser(prev => ({ ...prev }));
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>
      
      <Footer />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
}

export default App;
