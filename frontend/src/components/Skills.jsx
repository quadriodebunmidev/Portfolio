import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './loadingspinner';
import SkillsGlobe from './SkillsGlobe';

import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = ['all', 'frontend', 'backend', 'database', 'tools'];
  const headRef = useScrollReveal();
  const globeRef = useScrollReveal();
  const [loading, setLoading] = useState(true);
  const filterRef = useScrollReveal();

  useEffect(() => {
    axios.get('/api/skills').then(r =>{
      setSkills(r.data)
      setLoading(false)
  }).catch(() => {setLoading(false)});
  }, []);

  const filtered = activeCategory === 'all' ? skills : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,6vw,6vw)', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={headRef} className="reveal">
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>02 — Skills</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem', color: 'var(--text)' }}>The Tech I Work With</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'clamp(2rem,4vw,3rem)', maxWidth: '500px', lineHeight: 1.7, fontSize: '0.95rem' }}>
            A curated stack built over 3 years of real-world projects — drag the sphere to explore.
          </p>
        </div>

        <div ref={globeRef} className="reveal-scale">
          <SkillsGlobe />
        </div>

        {/* Category filter */}
        <div ref={filterRef} className="reveal" style={{ display: 'flex', gap: '0.6rem', margin: 'clamp(2rem,4vw,3rem) 0 2rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                       padding: '7px 16px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
                       background: activeCategory === c ? 'var(--accent)' : 'transparent',
                       color: activeCategory === c ? '#fff' : 'var(--text-muted)',
                       border: activeCategory === c ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Skill bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,150px), 2fr))', gap: '1rem' }}>
          {filtered.map((skill, i) => (
            <SkillCard key={skill._id} skill={skill} index={i} />
          ))}
        </div>
        {loading && <LoadingSpinner/>}
        {filtered.length === 0 && loading && (
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', fontFamily: 'Space Mono', fontSize: '0.85rem' }}>
            No skills in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill, index }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal delay-${Math.min((index % 6) + 1, 6)}`}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.2rem', transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{skill.name}</span>
        <span style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--accent)' }}>{skill.proficiency}%</span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${skill.proficiency}%`, background: 'linear-gradient(to right, var(--accent), var(--accent-2))', borderRadius: '2px', transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      <span style={{ fontFamily: 'Space Mono', fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.6rem', display: 'block' }}>{skill.category}</span>
    </div>
  );
}
