import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navLinks = ['Home','About','Skills','Projects','Experience','Certificates','Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks.map(l => l.toLowerCase());
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '0.8rem 2rem' : '1.2rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'var(--bg-card)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: scrolled ? 'var(--shadow)' : 'none'
      }}>
        <div style={{ fontFamily: 'Space Mono', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em', display:'flex', alignItems:'center', gap:'2px' }}>
          <span style={{ color: 'var(--accent)' }}>finesse</span><span style={{ color: 'var(--text)' }}>Dev</span>
        </div>

        <ul style={{ display: 'flex', gap: '0.2rem', listStyle: 'none', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => {
            const isActive = activeSection === link.toLowerCase();
            return (
              <li key={link}>
                <button onClick={() => scrollTo(link)} style={{
                  background: isActive ? 'var(--accent-glow)' : 'none',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.82rem', letterSpacing: '0.02em', fontFamily: 'var(--font-display)',
                  fontWeight: isActive ? 600 : 400, cursor: 'pointer',
                  transition: 'all 0.2s', padding: '6px 12px', borderRadius: '6px', border: 'none'
                }}
                onMouseOver={e => { if (!isActive) e.target.style.color='var(--text)'; }}
                onMouseOut={e => { if (!isActive) e.target.style.color='var(--text-muted)'; }}>
                  {link}
                </button>
              </li>
            );
          })}
        </ul>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Theme toggle */}
          <button onClick={toggle} title="Toggle theme" style={{
            width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-hover)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
          }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--accent)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{
            display: 'none', background: 'none', color: 'var(--text)', fontSize: '1.3rem', border: 'none'
          }}>{menuOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'var(--bg-card)', zIndex: 999, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)'
      }}>
        {navLinks.map(link => (
          <button key={link} onClick={() => scrollTo(link)} style={{
            background: 'none', border: 'none', color: activeSection === link.toLowerCase() ? 'var(--accent)' : 'var(--text)',
            fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: 600, cursor: 'pointer'
          }}>{link}</button>
        ))}
       
      </div>

      <style>{`
        @media (max-width: 900px) { .desktop-nav { display: none !important; } .hamburger { display: flex !important; } }
      `}</style>
    </>
  );
}
