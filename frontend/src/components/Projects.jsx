import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './loadingspinner';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ProjectModal from './ProjectModal';

const categoryLabels = { fullstack:'Full Stack', frontend:'Frontend', backend:'Backend', api:'API', other:'Other' };

/* ── gradient placeholder colours per category ── */
const catGrad = {
  fullstack: 'linear-gradient(135deg,#1a1f35 0%,#0d1525 100%)',
  frontend:  'linear-gradient(135deg,#1a1430 0%,#0d0f20 100%)',
  backend:   'linear-gradient(135deg,#1a2015 0%,#0d1510 100%)',
  api:       'linear-gradient(135deg,#201a10 0%,#150f05 100%)',
  other:     'linear-gradient(135deg,#1a1820 0%,#0f0d15 100%)',
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const headRef = useScrollReveal();

  useEffect(() => {
    axios.get('/api/projects').then(r => {
      setLoading(false)
      setProjects(r.data)

    }
    ).catch(() => {});
  }, []);

  const cats = ['all', ...new Set(projects.map(p => p.category))];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
  
  return (
    <section id="projects" style={{ padding:'clamp(4rem,8vw,8rem) clamp(1.25rem,6vw,6vw)', background:'var(--bg)' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
        <div ref={headRef} className="reveal">
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.73rem', color:'var(--accent)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.75rem' }}>03 — Projects</p>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'clamp(2rem,4vw,3rem)', flexWrap:'wrap', gap:'1.25rem' }}>
            <h2 style={{ fontSize:'clamp(1.9rem,4vw,3.1rem)', fontWeight:800, letterSpacing:'-0.04em', color:'var(--text)' }}>Selected Work</h2>
            <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap' }}>
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{
                  fontFamily:'var(--font-mono)', fontSize:'0.63rem', letterSpacing:'0.08em', textTransform:'uppercase',
                  padding:'6px 14px', borderRadius:'20px', cursor:'pointer', transition:'all 0.2s',
                  background: filter===c ? 'var(--accent)' : 'transparent',
                  color:       filter===c ? '#000'          : 'var(--text-muted)',
                  border:      filter===c ? '1px solid var(--accent)' : '1px solid var(--border)',
                  fontWeight:  filter===c ? 600 : 400,
                }}>
                  {c==='all' ? 'All' : categoryLabels[c]||c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,330px),1fr))', gap:'1.5rem' }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} onView={() => setSelected(project)} />
          ))}
        </div>
        {loading && <LoadingSpinner/>}

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'0.85rem' }}>
            No projects found. Add some via the admin panel.
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ProjectCard({ project, index, onView }) {
  const ref = useScrollReveal();
  const [hovered, setHovered] = useState(false);

  const hasCover = !!project.imageUrl;
  const grad = catGrad[project.category] || catGrad.other;

  return (
    <div
      ref={ref}
      className={`reveal-scale delay-${Math.min((index%6)+1,6)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onView}
      style={{
        background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius)',
        overflow:'hidden', cursor:'pointer', transition:'all 0.28s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'none',
        borderColor: hovered ? 'var(--accent-border)' : 'var(--border)',
      }}>

      {/* ── Cover image / placeholder ── */}
      <div style={{
        position:'relative', width:'100%', height:'190px', overflow:'hidden', flexShrink:0,
        background: hasCover ? '#000' : grad,
      }}>
        {hasCover ? (
          <img
            src={project.imageUrl} alt={project.title}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block',
                     transition:'transform 0.45s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        ) : (
          /* Decorative placeholder */
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'2.4rem', fontWeight:800, color:'rgba(255,255,255,0.06)', letterSpacing:'-0.05em', userSelect:'none' }}>
              {project.title.slice(0,2).toUpperCase()}
            </div>
            {/* decorative lines */}
            {[0,1,2].map(i => (
              <div key={i} style={{ width:`${55+i*15}%`, height:'1px', background:'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        )}

        {/* Overlay gradient at bottom */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'60px', background:'linear-gradient(to top, var(--bg-card), transparent)' }} />

        {/* Featured badge */}
        {project.featured && (
          <span style={{
            position:'absolute', top:'0.75rem', left:'0.75rem',
            fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'var(--accent)',
            letterSpacing:'0.14em', textTransform:'uppercase',
            border:'1px solid var(--accent-border)', background:'rgba(0,0,0,0.55)',
            backdropFilter:'blur(6px)', padding:'3px 10px', borderRadius:'20px',
          }}>★ Featured</span>
        )}

        {/* Live preview link */}
        {project.liveUrl && (
          <a
            href={project.liveUrl} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              position:'absolute', top:'0.75rem', right:'0.75rem',
              fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'#fff',
              letterSpacing:'0.1em', textTransform:'uppercase',
              background:'rgba(4, 0, 240, 0.85)', backdropFilter:'blur(6px)',
              padding:'4px 11px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'4px',
              transition:'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background='var(--accent)'}
            onMouseOut={e => e.currentTarget.style.background='rgba(16, 0, 240, 0.85)'}
          >
            Live ↗
          </a>
        )}
      </div>

      {/* ── Card body ── */}
      <div style={{ padding:'1.4rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.65rem', gap:'0.5rem' }}>
          <h3 style={{ fontSize:'1.05rem', fontWeight:700, letterSpacing:'-0.02em', color:'var(--text)', lineHeight:1.25 }}>{project.title}</h3>
          <div style={{ display:'flex', gap:'0.55rem', flexShrink:0 }} onClick={e => e.stopPropagation()}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer"
                style={{ width:'30px', height:'30px', borderRadius:'50%', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:'0.8rem', transition:'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='var(--accent-border)'; e.currentTarget.style.color='var(--accent)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
                ⌥
              </a>
            )}
          </div>
        </div>

        <p style={{ color:'var(--text-muted)', fontSize:'0.86rem', lineHeight:1.7, marginBottom:'1.1rem' }}>
          {project.description?.length > 110 ? project.description.slice(0,110)+'…' : project.description}
        </p>

        <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'1.1rem' }}>
          {project.techStack?.slice(0,4).map(t => (
            <span key={t} style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-muted)', background:'var(--bg)', border:'1px solid var(--border)', padding:'3px 9px', borderRadius:'5px', letterSpacing:'0.03em' }}>{t}</span>
          ))}
          {project.techStack?.length > 4 && (
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-dim)', padding:'3px 4px' }}>+{project.techStack.length-4}</span>
          )}
        </div>

        <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.67rem', color:'var(--accent)', letterSpacing:'0.05em', display:'inline-flex', alignItems:'center', gap:'5px' }}>
          View Details {hovered ? '→' : ''}
        </span>
      </div>
    </div>
  );
}