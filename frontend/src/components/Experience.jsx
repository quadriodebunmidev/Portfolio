import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './loadingspinner';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [active, setActive] = useState(0);
  const headRef = useScrollReveal();
  const bodyRef = useScrollReveal();

  useEffect(() => {   
  axios
    .get('/api/experience')
    .then((r) => {
      console.log(r.data)
     setExperiences(r.data) 
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

  
  const exp = experiences[active];

  return (
    <section id="experience" style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,6vw,6vw)', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={headRef} className="reveal">
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>04 — Experience</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 'clamp(2rem,4vw,3rem)', color: 'var(--text)' }}>Where I've Worked</h2>
        </div>
       
        <div ref={bodyRef} className="reveal exp-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{ borderRight: '1px solid var(--border)', borderBottom: 'none' }} className="exp-sidebar">
            {experiences.map((e, i) => (
              <button key={e._id} onClick={() => setActive(i)}
                style={{ display: 'block', width: '100%', padding: '1.2rem 1.5rem', textAlign: 'left',
                         background: active === i ? 'var(--accent-glow)' : 'transparent',
                         color: active === i ? 'var(--accent)' : 'var(--text-muted)', transition: 'all 0.2s', cursor: 'pointer', border: 'none',
                         borderLeft: active === i ? '2px solid var(--accent)' : '2px solid transparent' }}>
                <div style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', fontWeight: active === i ? 700 : 400, letterSpacing: '0.04em' }}>{e.company}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px', fontFamily: 'Space Mono' }}>{e.startDate}</div>
              </button>
            ))}
          </div>
          {/* Content */}
          <div style={{ padding: 'clamp(1.5rem,4vw,2rem) clamp(1.5rem,4vw,2.5rem)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)' }}>{exp?.role}</h3>
              {exp?.current && (
                <span style={{ fontFamily: 'Space Mono', fontSize: '0.62rem', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.08)', padding: '3px 10px', borderRadius: '20px' }}>● Current</span>
              )}
            </div>
            <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
              {exp?.startDate} — {exp?.current ? 'Present' : exp?.endDate}
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.9rem' }}>{exp?.description}</p>
            {exp?.achievements?.length > 0 && (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {exp.achievements.map((a, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', marginTop: '4px', flexShrink: 0 }}>▸</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{a}</span>
                  </li>
                ))}
              </ul>
            )}
            {exp?.techUsed?.length > 0 && (
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {exp.techUsed.map(t => (
                  <span key={t} style={{ fontFamily: 'Space Mono', fontSize: '0.62rem', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px' }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:600px){
          .exp-grid{ grid-template-columns:1fr !important; }
          .exp-sidebar{ display:flex; overflow-x:auto; border-right:none !important; border-bottom:1px solid var(--border); }
          .exp-sidebar button{ white-space:nowrap; border-left:none !important; border-bottom:2px solid transparent; flex-shrink:0; }
        }
      `}</style>
    </section>
  );
}
