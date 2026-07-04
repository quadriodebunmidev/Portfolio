import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const headRef = useScrollReveal();
  const leftRef = useScrollReveal();
  const rightRef = useScrollReveal();

  return (
    <section id="about" style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,6vw,6vw)', background: 'var(--bg)', overflowX:"hidden" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={headRef} className="reveal">
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>01 — About</p>
        </div>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'clamp(2.5rem,5vw,5rem)', alignItems: 'center' }}>
          <div ref={leftRef} className="reveal-left">
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Building the web,<br /><span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>one commit at a time.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.2rem', fontSize: '0.95rem' }}>
              I'm Odebunmi Quadri — a full stack developer from Lagos, Nigeria, known online as <span style={{ color: 'var(--accent)', fontFamily: 'Space Mono', fontSize: '0.85rem' }}>finesseDev</span>. I build fast, scalable, and visually compelling web applications.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.2rem', fontSize: '0.95rem' }}>
              With 3 years of hands-on experience across the full stack, I specialize in crafting intuitive frontends with React and Three.js, paired with robust backends using Node.js, Express, and MongoDB.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              I'm passionate about real-time systems, 3D web experiences, and writing clean code that scales. When I'm not coding, I'm probably exploring new tech or contributing to open source.
            </p>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[{name:'GitHub', value: "https://github.com/quadriodebunmidev"},{name:'LinkedIn', value: "https://www.linkedin.com/in/odebunmi-quadri-094878368"}, {name:'TikTok', value: "https://www.tiktok.com/@byte__bandit"}].map(s => (
                <a key={s.name} href={s.value} target='_blank' style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseOver={e => { e.target.style.color='var(--accent)'; e.target.style.borderColor='var(--accent)'; }}
                  onMouseOut={e => { e.target.style.color='var(--text-muted)'; e.target.style.borderColor='var(--border)'; }}>
                  {s.name} ↗
                </a>
              ))}
            </div>
          </div>
          <div ref={rightRef} className="reveal-right" style={{ position: 'relative' }}>
            <img src='https://i.postimg.cc/pTGFmshb/IMG-20260309-WA0016.jpg' style={{ width: '100%', height: "600px", background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow)' }}/>
             
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(to top, var(--bg-card), transparent)' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['Python','React','Node.js','Three.js','MongoDB'].map(t => (
                    <span key={t} style={{ fontFamily:'Space Mono', fontSize:'0.65rem', color:'var(--text-muted)', background:'var(--bg)', border:'1px solid var(--border)', padding:'3px 8px', borderRadius:'4px' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ position: 'relative', top: '-20px', right: '-20px', width: '120px', height: '120px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', zIndex: -1 }} />
          
        </div>
      </div>
      <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
