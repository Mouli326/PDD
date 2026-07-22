import React from 'react';
import { Briefcase } from 'lucide-react';

const TwitterIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: '5rem', padding: '3rem 0', background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex' }}>
                <Briefcase color="white" size={20} />
              </div>
              <span>Elevate</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.7' }}>
              Empowering the next generation of talent through AI-driven career matching and skill development.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li style={{ cursor: 'pointer' }}>Find Jobs</li>
              <li style={{ cursor: 'pointer' }}>Skill Analysis</li>
              <li style={{ cursor: 'pointer' }}>Learning Center</li>
              <li style={{ cursor: 'pointer' }}>Resume Builder</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Employers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <li style={{ cursor: 'pointer' }}>Post a Job</li>
              <li style={{ cursor: 'pointer' }}>Talent Pool</li>
              <li style={{ cursor: 'pointer' }}>Recruitment AI</li>
              <li style={{ cursor: 'pointer' }}>Pricing</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[<TwitterIcon key="tw" size={20} />, <GithubIcon key="gh" size={20} />, <LinkedinIcon key="li" size={20} />].map((Icon, i) => (
                <a key={i} href="#" style={{
                  padding: '0.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}>
                  {Icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <p>© 2026 Elevate AI — Smart Employment Platform</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Cookie Policy</span>
          </div>
          <p>M. Raja Mouli | Reg. No: 192372326</p>
        </div>
      </div>
    </footer>
  );
}
