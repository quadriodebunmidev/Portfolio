import { useEffect } from 'react';

const statusColors = { completed: '#4ade80', 'in-progress': '#fbbf24', archived: '#888' };

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem,4vw,2rem)',
        animation: 'fadeIn 0.2s ease'
      }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        width: '100%', maxWidth: '640px', maxHeight: '88vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)'
      }}>
        {/* Header banner */}
        <div style={{
          padding: 'clamp(6rem,4vw,2.5rem)', borderBottom: '1px solid var(--border)',
          background: project.imageUrl
            ? `linear-gradient(rgba(10,10,15,0.55), rgba(10,10,15,0.85)), url(${project.imageUrl}) center/cover`
            : 'linear-gradient(135deg, var(--accent-glow), transparent)',
          position: 'relative'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem', width: '34px', height: '34px',
            borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)',
            fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>

          {project.featured && (
            <span style={{ fontFamily: 'Space Mono', fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid var(--accent-border)', background: 'var(--accent-glow)', padding: '3px 10px', borderRadius: '20px' }}>★ Featured</span>
          )}
          <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 700, marginTop: '0.85rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>{project.title}</h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColors[project.status] || '#888' }} />
              {project.status}
            </span>
            <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-dim)' }}>·</span>
            <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{project.category}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)' }}>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            {project.longDescription || project.description}
          </p>

          {project.techStack?.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontFamily: 'Space Mono', fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Tech Stack</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {project.techStack.map(t => (
                  <span key={t} style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: '6px' }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{
                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff',
                fontWeight: 600, fontSize: '0.85rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}>Live Demo ↗</a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
                padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)',
                fontWeight: 500, fontSize: '0.85rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}>View Code ⌥</a>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0; transform:translateY(30px) scale(0.97)} to{opacity:1; transform:translateY(0) scale(1)} }
      `}</style>
    </div>
  );
}
