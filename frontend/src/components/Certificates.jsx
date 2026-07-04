import { useEffect, useState } from 'react';
import axios from 'axios';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const headRef = useScrollReveal();

  useEffect(() => {
    axios.get('https://portfolio-7tlk.vercel.app/api/certificates').then(r =>{ 
      setCerts(r.data)
    
  }).catch(() => {});
  }, []);

  // if (certs.length === 0) return null;

  return (
    <section id="certificates" style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,6vw,6vw)', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={headRef} className="reveal">
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>06 — Certifications</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 'clamp(2rem,4vw,3rem)', color: 'var(--text)' }}>Certifications & Credentials</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,280px), 1fr))', gap: '1.25rem' }}>
          {certs?.map((c, i) => <CertCard key={c._id} cert={c} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function CertCard({ cert, index }) {
  const ref = useScrollReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref} className={`reveal-scale delay-${Math.min((index % 6) + 1, 6)}`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: `src("${cert?.imageUrl}")`, border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '1.5rem', transition: 'all 0.25s', position: 'relative',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'none',
        borderColor: hovered ? 'var(--accent-border)' : 'var(--border)'
      }}>
        <img src={cert.imageUrl} style={{ width: '100%', height: '150px', borderRadius: '10px', background: 'var(--accent-glow)'}}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
        
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-glow)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🎓</div>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{cert.title}</h3>
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{cert.issuer}</p>
        </div>
      </div>
      {cert.description && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1rem' }}>{cert.description}</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '0.68rem', color: 'var(--text-dim)' }}>{cert.issueDate}</span>
        {cert.credentialUrl && (
          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ fontFamily: 'Space Mono', fontSize: '0.68rem', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Verify ↗
          </a>
        )}
      </div>
    </div>
  );
}
