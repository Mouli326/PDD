import React, { useState } from 'react';
import { Briefcase, Bell, Search, LogOut, Compass, Sparkles, FileText, Video, TrendingUp, ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout, setIsAuthOpen, currentView, onSetView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing',         label: 'Overview',          icon: Briefcase },
    { id: 'resume-analyzer', label: 'Resume Intelligence',icon: FileText },
    { id: 'dashboard',       label: 'Command Center',    icon: Compass },
    { id: 'chatbot',         label: 'Career AI Chat',     icon: Sparkles },
    { id: 'predictor',       label: 'Salary Forecast',    icon: TrendingUp },
  ];

  const handleNavClick = (viewId) => {
    onSetView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'sticky', top: '12px', zIndex: 100,
      margin: '0.75rem 1rem', padding: '0.75rem 1.25rem',
      background: 'rgba(15, 16, 23, 0.88)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => handleNavClick('landing')}
        >
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase style={{ color: 'white' }} size={20} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em' }} className="gradient-text">
            HireHub
          </span>
        </div>

        {/* Desktop Navigation Options */}
        <div style={{ display: 'none' }} className="desktop-nav">
          <style>{`
            @media (min-width: 1100px) {
              .desktop-nav { display: flex !important; align-items: center; gap: 0.375rem; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                  border: 'none', transition: 'all 0.2s',
                  background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(168,85,247,0.3)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', padding: '4px 10px 4px 6px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.08)' }}
                onClick={() => handleNavClick('dashboard')}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168,85,247,0.25)', border: '1px solid rgba(168,85,247,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{user.name}</span>
                </div>
              </div>

              <button 
                onClick={onLogout}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                background: 'var(--primary)', color: 'white', border: 'none',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.35)', transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '0.5rem', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
              color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: '1rem', paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '0.75rem 1rem', borderRadius: '0.625rem',
                  fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                  border: 'none', transition: 'all 0.2s', textAlign: 'left',
                  background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
